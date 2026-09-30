import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { useAuthStep } from '../hooks/useAuthStep';
import { useSignin } from '../hooks/useSignin';
import { AccountIconName } from './common/AccountIcon.Name';
import { FormInput } from './common/FormInput';
import { GlassButton } from './common/GlassButton';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';
import './SetupTOTPCode.scss';

export const SetupTOTPCode = () => {
  const { authStep, setAuthStep } = useAuthStep<'SETUP_TOTP_CODE'>();
  const [code, setCode] = useState<string>('');
  const { setupTOTP } = useSignin();

  return (
    <InputAccountInfoTemplateLayout
      authAction={() =>
        setupTOTP({
          accountId: authStep.accountId,
          accountName: authStep.accountName,
          code,
        })
      }
      errorMessage="TOTPコードのセットアップに失敗しました。"
      formContent={
        <>
          <AccountIconName>{authStep.accountName}</AccountIconName>
          <div className="setup-totp-code__qr-code">
            <QRCodeSVG value={authStep.setupUri} />
          </div>
          <FormInput
            id="code"
            type="text"
            label="確認用TOTPコード"
            value={code}
            setValue={setCode}
          />
        </>
      }
      footerContent={
        <GlassButton
          onClick={() => {
            setAuthStep({
              type: 'SELECT_ACCOUNT',
              accountId: authStep.accountId,
              accountName: authStep.accountName,
            });
          }}
        >
          MAF認証を利用しない。
        </GlassButton>
      }
    />
  );
};

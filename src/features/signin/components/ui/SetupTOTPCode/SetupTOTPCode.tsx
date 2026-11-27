import { AccountIconName } from '@/features/signin/components/ui-primitive/AccountIconName/AccountIconName';
import { FormInput } from '@/features/signin/components/ui-primitive/FormInput/FormInput';
import { GlassButton } from '@/features/signin/components/ui-primitive/GlassButton/GlassButton';
import { InputAccountInfoTemplateLayout } from '@/features/signin/components/ui-primitive/InputAccountInfoTemplateLayout';
import { useAuthStep } from '@/features/signin/hooks/useAuthStep';
import { useSignin } from '@/features/signin/hooks/useSignin';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
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

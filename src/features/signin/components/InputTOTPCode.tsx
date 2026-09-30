import { useSignin } from '@/features/signin/hooks/useSignin';
import { useState } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import { useAuthStep } from '../hooks/useAuthStep';
import { FormInput } from './common/FormInput';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';
import { LinkButton } from './common/LinkButton';
import { UserIconName } from './common/UserIcon.Name';

/**
 * TOTPコード入力画面
 * @returns Reactコンポーネント
 */
export const InputTOTPCode = () => {
  const { signinWithTotp } = useSignin();
  const { authStep, prevAuthStep } = useAuthStep<'INPUT_TOTP_CODE'>();
  const [code, setCode] = useState('');

  return (
    <InputAccountInfoTemplateLayout
      authAction={() => signinWithTotp(code)}
      errorMessage="認証コードが間違っています。"
      formContent={
        <>
          <UserIconName>{authStep.name}</UserIconName>
          <FormInput
            id="totp-code"
            type="text"
            label="TOTPコード"
            value={code}
            setValue={setCode}
            autoComplete="username"
          />
        </>
      }
      footerContent={
        <LinkButton onClick={prevAuthStep}>
          <BsChevronLeft />
          戻る
        </LinkButton>
      }
    />
  );
};

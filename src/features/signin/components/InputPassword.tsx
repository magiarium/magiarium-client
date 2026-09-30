import { useSignin } from '@/features/signin/hooks/useSignin';
import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useAuthStep } from '../hooks/useAuthStep';
import { AccountIconName } from './common/AccountIcon.Name';
import { FormInput } from './common/FormInput';
import { GlassButton } from './common/GlassButton';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';

/**
 * パスワード入力画面
 *
 * @returns Reactコンポーネント
 */
export const InputPassword = () => {
  const [password, setPassword] = useState<string>('');
  const { authStep, prevAuthStep } = useAuthStep<'INPUT_PASSWORD'>();
  const { signinWithPassword } = useSignin();

  return (
    <InputAccountInfoTemplateLayout
      authAction={() =>
        signinWithPassword({
          accountId: authStep.accountId,
          accountName: authStep.accountName,
          password,
        })
      }
      errorMessage="パスワードが間違っています。"
      formContent={
        <>
          <AccountIconName>{authStep.accountName}</AccountIconName>
          <FormInput
            id="password"
            type="password"
            label="パスワード"
            value={password}
            setValue={setPassword}
            autoComplete="current-password"
          />
        </>
      }
      footerContent={
        <GlassButton onClick={prevAuthStep}>
          <BsArrowLeft />
          アカウントの切り替え
        </GlassButton>
      }
    />
  );
};

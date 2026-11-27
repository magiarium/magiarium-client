import { AccountIconName } from '@/features/signin/components/ui-primitive/AccountIconName/AccountIconName';
import { FormInput } from '@/features/signin/components/ui-primitive/FormInput/FormInput';
import { GlassButton } from '@/features/signin/components/ui-primitive/GlassButton/GlassButton';
import { InputAccountInfoTemplateLayout } from '@/features/signin/components/ui-primitive/InputAccountInfoTemplateLayout';
import { useAuthStep } from '@/features/signin/hooks/useAuthStep';
import { useSignin } from '@/features/signin/hooks/useSignin';
import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';

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

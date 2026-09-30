import { useSignin } from '@/features/signin/hooks/useSignin';
import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useAuthStep } from '../hooks/useAuthStep';
import { FormInput } from './common/FormInput';
import { GlassButton } from './common/GlassButton';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';
import { UserIconName } from './common/UserIcon.Name';

/**
 * パスワード入力画面
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
          username: authStep.name,
          icon: authStep.icon,
          password,
        })
      }
      errorMessage="パスワードが間違っています。"
      formContent={
        <>
          <UserIconName>{authStep.name}</UserIconName>
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
          ユーザーの切り替え
        </GlassButton>
      }
    />
  );
};

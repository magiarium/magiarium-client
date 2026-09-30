import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useAuthStep } from '../hooks/useAuthStep';
import { useSignin } from '../hooks/useSignin';
import { FormInput } from './common/FormInput';
import { GlassButton } from './common/GlassButton';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';

/**
 * 他アカウントでサインイン
 * @returns Reactコンポーネント
 */
export const SigninOtherAccount = () => {
  const { authStep, prevAuthStep } = useAuthStep<'SIGNIN_OTHER_ACCOUNT'>();
  const [username, setUsername] = useState(authStep.name);
  const [password, setPassword] = useState('');

  const { signinWithPassword } = useSignin();

  return (
    <InputAccountInfoTemplateLayout
      authAction={() =>
        signinWithPassword({
          username: username,
          icon: authStep.icon,
          password,
        })
      }
      errorMessage="ユーザー名またはパスワードが正しくありません"
      formContent={
        <>
          <FormInput
            id="username"
            type="text"
            label="ユーザー名"
            value={username}
            setValue={setUsername}
            autoComplete="username"
          />
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

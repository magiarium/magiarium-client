import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useAuthStep } from '../hooks/useAuthStep';
import { useSignin } from '../hooks/useSignin';
import { FormInput } from './common/FormInput';
import { GlassButton } from './common/GlassButton';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';

/**
 * 他アカウントでサインイン
 *
 * @returns Reactコンポーネント
 */
export const SigninOtherAccount = () => {
  const { authStep, prevAuthStep } = useAuthStep<'SIGNIN_OTHER_ACCOUNT'>();
  const [username, setUsername] = useState(authStep.accountName);
  const [password, setPassword] = useState('');

  const { signinWithPassword } = useSignin();

  return (
    <InputAccountInfoTemplateLayout
      authAction={() =>
        signinWithPassword({
          accountId: authStep.accountId,
          accountName: username,
          password,
        })
      }
      errorMessage="アカウント名またはパスワードが正しくありません"
      formContent={
        <>
          <FormInput
            id="username"
            type="text"
            label="アカウント名"
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
          アカウントの切り替え
        </GlassButton>
      }
    />
  );
};

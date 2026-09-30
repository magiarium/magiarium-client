import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useAuthStep } from '../hooks/useAuthStep';
import { useSignin } from '../hooks/useSignin';
import { ErrorMessage } from './common/ErrorMessage';
import { FormInput } from './common/FormInput';
import { GlassButton } from './common/GlassButton';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';
import { UserIconName } from './common/UserIcon.Name';

/**
 * パスワードセットアップ画面
 * @returns Reactコンポーネント
 */
export const SetupPassword = () => {
  const { authStep, prevAuthStep } = useAuthStep<'SETUP_PASSWORD'>();
  const [newPassword, setNewPassword] = useState<string>('');
  const { setupPassword } = useSignin();

  return (
    <InputAccountInfoTemplateLayout
      authAction={() => setupPassword(newPassword)}
      errorMessage="パスワードの更新に失敗しました。"
      formContent={
        <>
          <UserIconName>{authStep.name}</UserIconName>
          <ErrorMessage>パスワードをリセットしてください。</ErrorMessage>
          <FormInput
            id="password"
            type="password"
            label="パスワード"
            value={newPassword}
            setValue={setNewPassword}
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

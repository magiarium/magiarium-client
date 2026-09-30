import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useAuthStep } from '../hooks/useAuthStep';
import { useSignin } from '../hooks/useSignin';
import { AccountIconName } from './common/AccountIcon.Name';
import { ErrorMessage } from './common/ErrorMessage';
import { FormInput } from './common/FormInput';
import { GlassButton } from './common/GlassButton';
import { InputAccountInfoTemplateLayout } from './common/InputAccountInfoTemplateLayout';

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
          <AccountIconName>{authStep.accountName}</AccountIconName>
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
          アカウントの切り替え
        </GlassButton>
      }
    />
  );
};

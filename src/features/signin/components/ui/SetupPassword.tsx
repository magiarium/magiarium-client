import { AccountIconName } from '@/features/signin/components/ui-primitive/AccountIconName/AccountIconName';
import { ErrorMessage } from '@/features/signin/components/ui-primitive/ErrorMessage/ErrorMessage';
import { FormInput } from '@/features/signin/components/ui-primitive/FormInput/FormInput';
import { GlassButton } from '@/features/signin/components/ui-primitive/GlassButton/GlassButton';
import { InputAccountInfoTemplateLayout } from '@/features/signin/components/ui-primitive/InputAccountInfoTemplateLayout';
import { useAuthStep } from '@/features/signin/hooks/useAuthStep';
import { useSignin } from '@/features/signin/hooks/useSignin';
import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';

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

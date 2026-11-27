import { LoadingCircle } from '@/common/components/LoadingCircle/LoadingCircle';
import { AccountIconImage } from '@/features/signin/components/ui-primitive/AccountIconImage';
import { ErrorMessage } from '@/features/signin/components/ui-primitive/ErrorMessage';
import { SubmitButton } from '@/features/signin/components/ui-primitive/SubmitButton/SubmitButton';
import { AuthStep } from '@/features/signin/contexts/AuthStepContext';
import { useAuthStep } from '@/features/signin/hooks/useAuthStep';
import type { Dispatch, SetStateAction } from 'react';
import { ReactNode, useState } from 'react';
import './InputAccountInfoTemplateLayout.scss';

export type SetError = Dispatch<SetStateAction<string>>;

/**
 * アカウント情報入力画面のテンプレートレイアウト
 *
 * @param params.formContent フォームコンテンツ
 * @param params.footerContent フッターコンテンツ
 * @param params.authAction 認証アクション
 * @param params.errorMessage エラーメッセージ
 * @returns Reactコンポーネント
 */
export const InputAccountInfoTemplateLayout = ({
  formContent,
  footerContent,
  authAction,
  errorMessage,
}: {
  formContent: ReactNode;
  footerContent: ReactNode;
  authAction: () => Promise<AuthStep>;
  errorMessage: string;
}) => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authStep, setAuthStep } = useAuthStep();

  const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const result = await authAction();
      setAuthStep(result);
    } catch {
      setError(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="input-accountinfo-template">
      <AccountIconImage id={authStep.accountId} />
      {isLoading ? (
        <>
          認証中
          <LoadingCircle />
        </>
      ) : (
        <>
          <form
            className="input-accountinfo-template__form"
            onSubmit={submitHandler}
          >
            <fieldset className="input-accountinfo-template__fieldset">
              {formContent}
            </fieldset>
            <div className="input-accountinfo-template__submit-button">
              <SubmitButton />
            </div>
          </form>
          <ErrorMessage>{error}</ErrorMessage>
          <div className="input-accountinfo-template__footer">
            {footerContent}
          </div>
        </>
      )}
    </div>
  );
};

import { LoadingCircle } from '@/common/components/LoadingCircle';
import type { Dispatch, SetStateAction, SubmitEvent } from 'react';
import { ReactNode, useState } from 'react';
import { AuthStep } from '../../contexts/AuthStepContext';
import { useAuthStep } from '../../hooks/useAuthStep';
import { AccountIconImage } from './AccountIcon.Image';
import { ErrorMessage } from './ErrorMessage';
import './InputAccountInfoTemplateLayout.scss';
import { SubmitButton } from './SubmitButton';

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

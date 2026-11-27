'use client';
import { LoadingCircle } from '@/common/components/LoadingCircle/LoadingCircle';
import { LoadingOverlay } from '@/common/components/LoadingOverlay/LoadingOverlay';
import { useAppState } from '@/features/app-controller/hooks/useAppState';
import { ErrorMessage } from '@/features/signin/components/ui-primitive/ErrorMessage/ErrorMessage';
import { InputPassword } from '@/features/signin/components/ui/InputPassword';
import { InputTOTPCode } from '@/features/signin/components/ui/InputTOTPCode';
import { SelectAccount } from '@/features/signin/components/ui/SelectAccount';
import { SetupPassword } from '@/features/signin/components/ui/SetupPassword';
import { SetupTOTPCode } from '@/features/signin/components/ui/SetupTOTPCode';
import { SigninOtherAccount } from '@/features/signin/components/ui/SigninOtherAccount';
import {
  AuthStep,
  AuthStepContext,
} from '@/features/signin/contexts/AuthStepContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './LockPage.scss';

/**
 * サインイン用のロックページ
 * ※ファイル名は分かりやすさ重視でMain.tsxにしているが、それ以外の理由はないため必要に応じてリネームは自由
 */
export const LockPage = () => {
  // 初期状態はアカウント選択画面のため、ユーザー不明扱い
  const [authStep, setAuthStep] = useState<AuthStep>({
    type: 'SELECT_ACCOUNT',
    accountId: '',
    accountName: '',
  });

  const { appState, setAppState } = useAppState();

  // マウント時に"LOCKED"状態に、アンマウント時に"READY"状態に更新する
  useEffect(() => {
    // マウント時にアプリケーションをロック状態に更新
    setAppState('LOCKED');
    return () => {
      setAppState('DEFAULT'); // アンマウント時にDEFAULTに更新
    };
  }, []);

  // 認証が完了した場合は数秒待機後、Top画面に遷移
  const router = useRouter();
  useEffect(() => {
    if (authStep.type === 'DONE') {
      const timer = setTimeout(() => {
        router.push('/');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [authStep]);

  return (
    <>
      <AuthStepContext.Provider value={{ authStep, setAuthStep }}>
        <div className="lock-page">
          <div className="lock-page__screen">
            {(() => {
              switch (authStep.type) {
                case 'SELECT_ACCOUNT':
                  return <SelectAccount />;
                case 'INPUT_PASSWORD':
                  return <InputPassword />;
                case 'SIGNIN_OTHER_ACCOUNT':
                  return <SigninOtherAccount />;
                case 'INPUT_TOTP_CODE':
                  return <InputTOTPCode />;
                case 'SETUP_TOTP_CODE':
                  return <SetupTOTPCode />;
                case 'SETUP_PASSWORD':
                  return <SetupPassword />;
                case 'DONE':
                  return (
                    <>
                      ようこそ、{authStep.accountName} さま
                      <LoadingCircle />
                    </>
                  );
                default:
                  // 存在しないルートのため、あくまでもデバッグ用
                  return (
                    <ErrorMessage>
                      [システムエラー]予期せぬ操作が検知されました。
                    </ErrorMessage>
                  );
              }
            })()}
          </div>
        </div>
      </AuthStepContext.Provider>
      <LoadingOverlay isLoading={appState !== 'LOCKED'} overlayColor="black" />
    </>
  );
};

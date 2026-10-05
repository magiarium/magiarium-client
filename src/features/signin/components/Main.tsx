'use client';
import { LoadingCircle } from '@/common/components/LoadingCircle';
import { LoadingOverlay } from '@/common/components/LoadingOverlay';
import { useAppState } from '@/features/app-controller/hooks/useAppState';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthStep, AuthStepContext } from '../contexts/AuthStepContext';
import { ErrorMessage } from './common/ErrorMessage';
import { InputPassword } from './InputPassword';
import { InputTOTPCode } from './InputTOTPCode';
import './Main.scss';
import { SelectAccount } from './SelectAccount';
import { SetupPassword } from './SetupPassword';
import { SetupTOTPCode } from './SetupTOTPCode';
import { SigninOtherAccount } from './SigninOtherAccount';

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
      setAppState('READY'); // アンマウント時にREADYに更新
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
      <LoadingOverlay isLoading={appState !== 'LOCKED'} overlayColor="black" />
      <AuthStepContext value={{ authStep, setAuthStep }}>
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
      </AuthStepContext>
    </>
  );
};

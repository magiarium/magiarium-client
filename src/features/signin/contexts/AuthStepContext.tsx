import { createContext, Dispatch, SetStateAction } from 'react';

/**
 * 認証ステップ種別
 */
export type AuthStepType =
  | 'DONE' // アカウント認証完了
  | 'SELECT_ACCOUNT' // アカウント選択
  | 'INPUT_PASSWORD' // パスワード入力
  | 'INPUT_TOTP_CODE' // TOTPコード入力
  | 'SIGNIN_OTHER_ACCOUNT' // 他のアカウントでサインイン
  | 'SETUP_PASSWORD' // パスワードセットアップ
  | 'SETUP_TOTP_CODE'; // TOTPコードセットアップ

/**
 * 認証ステップ基本定義
 */
type AuthStepBase<T extends AuthStepType> = {
  // 認証ステップ種別
  type: T;
  // アカウントID
  accountId: string;
  // アカウント名
  accountName: string;
  // 前ステップ
  prev?: AuthStep;
};

/**
 * 認証ステップ
 */
export type AuthStep<T extends AuthStepType = AuthStepType> = {
  DONE: AuthStepBase<'DONE'>;
  SELECT_ACCOUNT: AuthStepBase<'SELECT_ACCOUNT'>;
  INPUT_PASSWORD: AuthStepBase<'INPUT_PASSWORD'>;
  INPUT_TOTP_CODE: AuthStepBase<'INPUT_TOTP_CODE'>;
  SIGNIN_OTHER_ACCOUNT: AuthStepBase<'SIGNIN_OTHER_ACCOUNT'>;
  SETUP_PASSWORD: AuthStepBase<'SETUP_PASSWORD'>;
  SETUP_TOTP_CODE: AuthStepBase<'SETUP_TOTP_CODE'> & {
    setupUri: string;
  };
}[T];

type AuthStepContextProps = {
  authStep: AuthStep;
  setAuthStep: Dispatch<SetStateAction<AuthStep>>;
};

const AuthStepContext = createContext<AuthStepContextProps | null>(null);

export { AuthStepContext };

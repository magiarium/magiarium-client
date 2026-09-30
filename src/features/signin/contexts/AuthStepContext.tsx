import { ImageMetadata } from '@magiarium/structure';
import { createContext, Dispatch, SetStateAction } from 'react';

export type AuthStepType =
  | 'DONE' // アカウント認証完了
  | 'SELECT_USER_ACCOUNT' // アカウント選択
  | 'INPUT_PASSWORD' // パスワード入力
  | 'INPUT_TOTP_CODE' // TOTPコード入力
  | 'SIGNIN_OTHER_ACCOUNT' // 他のアカウントでサインイン
  | 'SETUP_PASSWORD' // パスワードセットアップ
  | 'SETUP_TOTP_CODE'; // TOTPコードセットアップ

type AuthStepBase<T extends AuthStepType> = {
  //
  type: T;
  // アカウント名
  name: string;
  // アカウントアイコン
  icon: ImageMetadata;
  // 前ステップ
  prev?: AuthStep;
};

export type AuthStep<T extends AuthStepType = AuthStepType> = {
  DONE: AuthStepBase<'DONE'>;
  SELECT_USER_ACCOUNT: AuthStepBase<'SELECT_USER_ACCOUNT'>;
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

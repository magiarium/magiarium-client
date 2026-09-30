import { UserDataManagerContext } from '@/features/auth/contexts/UserDataManagerContext';
import { extractCurrentUserAccountFromSession } from '@/features/auth/libs/extractCurrentUserAccountFromSession';
import { validateAuthSession } from '@/features/auth/libs/validateAuthSession';
import { UserAccountInfo } from '@/features/auth/type';
import { ImageMetadata } from '@magiarium/structure';
import {
  confirmSignIn,
  fetchAuthSession,
  setUpTOTP,
  signIn,
  signOut,
  verifyTOTPSetup,
} from 'aws-amplify/auth';
import { useContext } from 'react';
import { AuthStep } from '../contexts/AuthStepContext';

export const useSignin = () => {
  const context = useContext(UserDataManagerContext);

  if (!context) {
    throw new Error('UserDataManagerContextを初期化してください。');
  }

  const userDataManager = context;
  const { signin } = userDataManager;

  /**
   * 現在セッション中のユーザーでUIをサインイン状態にする
   * @returns サインインユーザー
   */
  const signinBySessionUser = async () => {
    const session = await fetchAuthSession();
    const currentUser = extractCurrentUserAccountFromSession(session);

    await signin(currentUser);
    return currentUser;
  };

  /**
   * 選択したユーザーでサインイン
   * @param targetAccount サインイン対象アカウント
   * @returns 次の認証ステップ
   */
  const signinBySelectUser = async (
    targetAccount: UserAccountInfo
  ): Promise<AuthStep> => {
    if (targetAccount.role === 'GUEST') {
      // ゲストユーザーの場合、そのままユーザー情報を更新
      signin(targetAccount);
      return {
        type: 'DONE',
        name: targetAccount.name,
        icon: targetAccount.icon,
      };
    } else {
      // ゲストユーザー以外の場合、認証チェック
      const session = await fetchAuthSession();
      const isValidateAuth = validateAuthSession({
        session,
        currentUserAccount: targetAccount,
      });
      if (isValidateAuth) {
        // 既にサインイン状態のため、ブラウザに状態反映して完了
        signin(targetAccount);
        return {
          type: 'DONE',
          name: targetAccount.name,
          icon: targetAccount.icon,
        };
      } else {
        // セッション切れのため、再ログイン
        return {
          type: 'INPUT_PASSWORD',
          name: targetAccount.name,
          icon: targetAccount.icon,
        };
      }
    }
  };

  /**
   * パスワードでサインイン
   * @param targetAccount サインイン対象アカウント
   * @param password パスワード
   * @returns 次の認証ステップ
   */
  const signinWithPassword = async ({
    username,
    icon,
    password,
  }: {
    username: string;
    icon: ImageMetadata;
    password: string;
  }): Promise<AuthStep> => {
    try {
      await signOut(); // サインインで転けるため、この時点でサインアウト
      const result = await signIn({
        username,
        password,
      });

      switch (result.nextStep.signInStep) {
        case 'DONE':
          const currentUser = await signinBySessionUser();
          return {
            type: 'DONE',
            name: currentUser.name,
            icon: icon,
          };

        case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
          return {
            type: 'INPUT_TOTP_CODE',
            name: username,
            icon: icon,
          };
        case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
          return {
            type: 'SETUP_PASSWORD',
            name: username,
            icon: icon,
          };
        case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
          return {
            type: 'SETUP_TOTP_CODE',
            name: username,
            icon: icon,
            setupUri: result.nextStep.totpSetupDetails
              .getSetupUri('まぎありうむ', username)
              .toString(),
          };

        default:
          throw new Error('サインイン失敗');
      }
    } catch {
      throw new Error('サインイン失敗');
    }
  };

  /**
   * TOTPコードサインイン
   * @param code TOTPコード
   * @returns 次の認証ステップ
   */
  const signinWithTotp = async (code: string): Promise<AuthStep> => {
    try {
      const result = await confirmSignIn({
        challengeResponse: code,
      });

      if (result.nextStep.signInStep === 'DONE') {
        const currentUser = await signinBySessionUser();

        return {
          type: 'DONE' as const,
          name: currentUser.name,
          icon: currentUser.icon,
        };
      }
      throw new Error('認証エラー');
    } catch {
      throw new Error('認証エラー');
    }
  };

  /**
   * パスワードセットアップ処理
   * @param password パスワード
   * @returns 次の認証ステップ
   */
  const setupPassword = async (password: string): Promise<AuthStep> => {
    try {
      const result = await confirmSignIn({
        challengeResponse: password,
      });
      if (result.nextStep.signInStep === 'DONE') {
        const currentUser = await signinBySessionUser();
        const totpSetupDetails = await setUpTOTP();
        return {
          type: 'SETUP_TOTP_CODE',
          name: currentUser.name,
          icon: currentUser.icon,
          setupUri: totpSetupDetails.getSetupUri('まぎありうむ').toString(),
        };
      }
      throw new Error('パスワードセットアップ失敗');
    } catch {
      throw Error('パスワードセットアップ失敗');
    }
  };

  /**
   * TOTPコードセットアップ
   * @param params.name アカウント名
   * @param params.icon アイコン画像情報
   * @param params.code TOTPコード
   * @returns 次の認証ステップ
   */
  const setupTOTP = async ({
    name,
    icon,
    code,
  }: {
    name: string;
    icon: ImageMetadata;
    code: string;
  }): Promise<AuthStep> => {
    try {
      verifyTOTPSetup({ code });
      return {
        type: 'DONE',
        name,
        icon,
      };
    } catch {
      throw new Error('認証エラー');
    }
  };

  return {
    signinBySelectUser,
    signinWithPassword,
    signinWithTotp,
    setupPassword,
    setupTOTP,
  };
};

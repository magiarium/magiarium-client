import { UserDataManagerContext } from '@/features/auth/contexts/UserDataManagerContext';
import { extractCurrentAccountFromSession } from '@/features/auth/libs/extractCurrentAccountFromSession';
import { validateAuthSession } from '@/features/auth/libs/validateAuthSession';
import type { AccountInfo } from '@/features/auth/type';
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
  const { changeCurrentAccount } = userDataManager;

  /**
   * セッション情報をもとに、カレントアカウントを更新する処理
   *
   * @returns カレントアカウント情報
   */
  const changeCurrentAccountBySessionUser = async () => {
    const session = await fetchAuthSession();
    const currentAccount = extractCurrentAccountFromSession(session);

    await changeCurrentAccount(currentAccount);
    return currentAccount;
  };

  /**
   * アカウント情報をもとにサインインする処理
   *
   * @param targetAccount アカウント情報
   * @returns 次の認証ステップ
   */
  const signinByAccountInfo = async (
    targetAccount: AccountInfo
  ): Promise<AuthStep> => {
    if (targetAccount.role === 'GUEST') {
      // ゲストアカウントの場合、認証をスキップして対象アカウントでカレントアカウントを更新
      changeCurrentAccount(targetAccount);
      return {
        type: 'DONE',
        accountId: targetAccount.id,
        accountName: targetAccount.name,
      };
    } else {
      // ゲストアカウント以外の場合、認証チェック
      const session = await fetchAuthSession();
      const isValidateAuth = validateAuthSession({
        session,
        currentAccount: targetAccount,
      });
      if (isValidateAuth) {
        // 既にサインイン状態のため、カレントアカウントを更新
        changeCurrentAccount(targetAccount);
        return {
          type: 'DONE',
          accountId: targetAccount.id,
          accountName: targetAccount.name,
        };
      } else {
        // セッション切れのため、認証ステップをパスワード入力(再ログイン)に更新
        return {
          type: 'INPUT_PASSWORD',
          accountId: targetAccount.id,
          accountName: targetAccount.name,
        };
      }
    }
  };

  /**
   * パスワードを入力してアカウントにサインインする処理
   *
   * @param params.accountId アカウントID
   * @param params.accountName アカウント名
   * @param params.password パスワード
   * @returns 次の認証ステップ
   */
  const signinWithPassword = async ({
    accountId,
    accountName,
    password,
  }: {
    accountId: string;
    accountName: string;
    password: string;
  }): Promise<AuthStep> => {
    try {
      await signOut(); // サインイン状態が残っていると失敗するため、この時点で機械的にサインアウト(空打ちは無害)
      const result = await signIn({
        username: accountName,
        password,
      });

      switch (result.nextStep.signInStep) {
        case 'DONE':
          // 成功
          const currentAccount = await changeCurrentAccountBySessionUser();
          return {
            type: 'DONE',
            accountId: currentAccount.id,
            accountName: currentAccount.name,
          };

        case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
          // TOTPコードの追加入力が必要
          return {
            type: 'INPUT_TOTP_CODE',
            accountId,
            accountName,
          };
        case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
          // パスワード強制リセットが必要(初回ログインのみ)
          return {
            type: 'SETUP_PASSWORD',
            accountId,
            accountName,
          };
        case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
          // TOTPコードのセットアップが必要(任意にしたので現状不要処理だが、今後必要になる可能性があるため残しておく)
          return {
            type: 'SETUP_TOTP_CODE',
            accountId,
            accountName,
            setupUri: result.nextStep.totpSetupDetails
              .getSetupUri('まぎありうむ', accountName)
              .toString(),
          };

        default:
          // 現状存在しないルート(予期せぬ操作のため例外を投げてエラー扱い)
          throw new Error('サインイン失敗');
      }
    } catch {
      throw new Error('サインイン失敗');
    }
  };

  /**
   * TOTPコードサインイン
   *
   * @param code TOTPコード
   * @returns 次の認証ステップ
   */
  const signinWithTotp = async (code: string): Promise<AuthStep> => {
    try {
      const result = await confirmSignIn({
        challengeResponse: code,
      });

      if (result.nextStep.signInStep === 'DONE') {
        const currentUser = await changeCurrentAccountBySessionUser();

        return {
          type: 'DONE' as const,
          accountId: currentUser.id,
          accountName: currentUser.name,
        };
      }
      throw new Error('認証エラー');
    } catch {
      throw new Error('認証エラー');
    }
  };

  /**
   * パスワードセットアップ処理
   *
   * @param password パスワード
   * @returns 次の認証ステップ
   */
  const setupPassword = async (password: string): Promise<AuthStep> => {
    try {
      const result = await confirmSignIn({
        challengeResponse: password,
      });
      if (result.nextStep.signInStep === 'DONE') {
        const currentUser = await changeCurrentAccountBySessionUser();
        const totpSetupDetails = await setUpTOTP();
        return {
          type: 'SETUP_TOTP_CODE',
          accountId: currentUser.id,
          accountName: currentUser.name,
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
   *
   * @param params.accountId アカウントID
   * @param params.accountName アカウント名
   * @param params.code TOTPコード
   * @returns 次の認証ステップ
   */
  const setupTOTP = async ({
    accountId,
    accountName,
    code,
  }: {
    accountId: string;
    accountName: string;
    code: string;
  }): Promise<AuthStep> => {
    try {
      verifyTOTPSetup({ code });
      return {
        type: 'DONE',
        accountId,
        accountName,
      };
    } catch {
      throw new Error('認証エラー');
    }
  };

  return {
    signinByAccountInfo,
    signinWithPassword,
    signinWithTotp,
    setupPassword,
    setupTOTP,
  };
};

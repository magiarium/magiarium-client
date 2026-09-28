import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { cookies } from 'next/headers';
import {
  AVAILABLE_USER_ACCOUNTS_COOKIE_KEY,
  CURRENT_USER_ACCOUNT_COOKIE_KEY,
  GUEST_USER_ACCOUNT,
  UserAccountInfo,
  UserData,
} from '../type';
import { extractCurrentUserAccountFromSession } from './extractCurrentUserAccountFromSession';
import { runWithAmplifyServerContext } from './runWithAmplifyServerContext';
import { validateAuthSession } from './validateAuthSession';

/**
 * cookieからユーザーデータを取得する処理
 * ※サーバーサイド用(next/headersがServer-Onlyのため、クライアントで実行するとエラーになる)
 *
 * @returns　ユーザーデータ&認証切れチェックフラグ
 */
export const getUserDataFromCookies = async (): Promise<
  UserData & { isAuthExpired: boolean }
> => {
  const cookieStore = await cookies();
  // 1.ユーザーアカウント一覧をcookieから復元
  const availableUserAccountsCookie = cookieStore.get(
    AVAILABLE_USER_ACCOUNTS_COOKIE_KEY
  );
  const availableUserAccounts = availableUserAccountsCookie
    ? [GUEST_USER_ACCOUNT, ...JSON.parse(availableUserAccountsCookie.value)]
    : [GUEST_USER_ACCOUNT];

  // 2.現在のユーザーアカウントを取得
  const currentUserAccountCookie = cookieStore.get(
    CURRENT_USER_ACCOUNT_COOKIE_KEY
  );
  if (!currentUserAccountCookie) {
    // cookieがない場合、初回ログインとしてゲストユーザー扱い
    return {
      currentUserAccount: GUEST_USER_ACCOUNT,
      isAuthExpired: false,
      availableUserAccounts,
    };
  }
  const currentUserAccount: UserAccountInfo = JSON.parse(
    currentUserAccountCookie.value
  );
  if (currentUserAccount.role === 'GUEST') {
    // ユーザーロールがGUESTの場合、一律ゲストユーザー扱い
    return {
      currentUserAccount: GUEST_USER_ACCOUNT,
      isAuthExpired: false,
      availableUserAccounts,
    };
  }
  // ゲストユーザー以外の場合、実際のセッション情報チェック
  const session = await runWithAmplifyServerContext({
    nextServerContext: {
      cookies,
    },
    operation: (contextSpec) => fetchAuthSession(contextSpec),
  });

  try {
    const currentUserAccount = extractCurrentUserAccountFromSession(session);
    if (!validateAuthSession({ session, currentUserAccount })) {
      // cookieと実際のセッション情報が異なるため、サインアウトしてゲストアカウント扱い
      await signOut();
      return {
        currentUserAccount: GUEST_USER_ACCOUNT,
        availableUserAccounts,
        isAuthExpired: true,
      };
    }
    return {
      currentUserAccount,
      isAuthExpired: false,
      availableUserAccounts,
    };
  } catch {
    // 例外は認証切れとしてキャッチ → 認証切れフラグを立ててゲストアカウント扱い
    return {
      currentUserAccount: GUEST_USER_ACCOUNT,
      availableUserAccounts,
      isAuthExpired: true,
    };
  }
};

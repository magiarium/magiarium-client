import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { cookies } from 'next/headers';
import {
  AVAILABLE_ACCOUNTS_COOKIE_KEY,
  CURRENT_ACCOUNT_COOKIE_KEY,
  GUEST_ACCOUNT,
} from '../constants';
import type { AccountInfo, UserData } from '../type';
import { extractCurrentAccountFromSession } from './extractCurrentAccountFromSession';
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
  // 1.利用可能アカウント一覧をcookieから復元
  const availableAccountsCookie = cookieStore.get(
    AVAILABLE_ACCOUNTS_COOKIE_KEY
  );
  const availableAccounts = availableAccountsCookie
    ? [GUEST_ACCOUNT, ...JSON.parse(availableAccountsCookie.value)]
    : [GUEST_ACCOUNT];

  // 2.カレントアカウントを取得
  const currentAccountCookie = cookieStore.get(CURRENT_ACCOUNT_COOKIE_KEY);
  if (!currentAccountCookie) {
    // cookieがない場合、初回ログインとしてゲストアカウント扱い
    return {
      currentAccount: GUEST_ACCOUNT,
      isAuthExpired: false,
      availableAccounts,
    };
  }
  const currentAccount: AccountInfo = JSON.parse(currentAccountCookie.value);
  if (currentAccount.role === 'GUEST') {
    // 権限ロールがGUESTの場合、一律ゲストアカウント扱い
    return {
      currentAccount: GUEST_ACCOUNT,
      isAuthExpired: false,
      availableAccounts,
    };
  }
  // ゲストアカウント以外の場合、実際のセッション情報チェック
  const session = await runWithAmplifyServerContext({
    nextServerContext: {
      cookies,
    },
    operation: (contextSpec) => fetchAuthSession(contextSpec),
  });

  try {
    const currentAccount = extractCurrentAccountFromSession(session);
    if (!validateAuthSession({ session, currentAccount })) {
      // cookieと実際のセッション情報が異なるため、サインアウトしてゲストアカウント扱い
      await signOut();
      return {
        currentAccount: GUEST_ACCOUNT,
        availableAccounts,
        isAuthExpired: true,
      };
    }
    return {
      currentAccount,
      isAuthExpired: false,
      availableAccounts,
    };
  } catch {
    // 例外は認証切れとしてキャッチ → 認証切れフラグを立ててゲストアカウント扱い
    return {
      currentAccount: GUEST_ACCOUNT,
      availableAccounts,
      isAuthExpired: true,
    };
  }
};

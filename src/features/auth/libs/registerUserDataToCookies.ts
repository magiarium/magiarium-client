import Cookie from 'js-cookie';
import {
  AVAILABLE_USER_ACCOUNTS_COOKIE_KEY,
  CURRENT_USER_ACCOUNT_COOKIE_KEY,
  UserAccountInfo,
} from '../type';

export const registerUserDataToCookies = (
  signinUserAccount: UserAccountInfo
) => {
  if (signinUserAccount.role === 'GUEST') {
    // ゲストアカウントは登録不要
    return;
  }

  // 現在のユーザーアカウントを切り替え
  Cookie.set(
    CURRENT_USER_ACCOUNT_COOKIE_KEY,
    JSON.stringify(signinUserAccount)
  );

  // 利用可能アカウントリストも更新
  const availableUserAccountsCookie = Cookie.get(
    AVAILABLE_USER_ACCOUNTS_COOKIE_KEY
  );
  const availableUserAccounts: UserAccountInfo[] = [signinUserAccount];
  if (availableUserAccountsCookie) {
    // 未登録ユーザー&ユーザーロールがGUEST以外であれば、新規登録
    const rest = JSON.parse(availableUserAccountsCookie).filter(
      (targetAccount: UserAccountInfo) =>
        targetAccount.id !== signinUserAccount.id &&
        targetAccount.role !== 'GUEST'
    );
    availableUserAccounts.push(...rest);
  }
  Cookie.set(
    AVAILABLE_USER_ACCOUNTS_COOKIE_KEY,
    JSON.stringify(availableUserAccounts)
  );
};

import Cookie from 'js-cookie';
import {
  AVAILABLE_USER_ACCOUNTS_COOKIE_KEY,
  CURRENT_USER_ACCOUNT_COOKIE_KEY,
  UserAccountInfo,
} from '../type';

export const registerUserDataToCookies = (
  signinUserAccount: UserAccountInfo
) => {
  // GUESTは「現在ユーザー」としてCookieに保持しない&以降の処理をスキップ
  if (signinUserAccount.role === 'GUEST') {
    Cookie.remove(CURRENT_USER_ACCOUNT_COOKIE_KEY, {
      path: '/',
    });
    return;
  }

  // 現在のユーザーアカウントを切り替え
  Cookie.set(
    CURRENT_USER_ACCOUNT_COOKIE_KEY,
    JSON.stringify(signinUserAccount),
    {
      path: '/',
      secure: true,
      sameSite: 'strict',
      expires: 7, // 有効期限は7日間
    }
  );

  // 利用可能アカウントリストも更新
  const availableUserAccountsCookie = Cookie.get(
    AVAILABLE_USER_ACCOUNTS_COOKIE_KEY
  );
  const availableUserAccounts: UserAccountInfo[] = [signinUserAccount];
  if (availableUserAccountsCookie) {
    // 未登録ユーザーであれば、新規登録
    const rest = JSON.parse(availableUserAccountsCookie).filter(
      (targetAccount: UserAccountInfo) =>
        targetAccount.id !== signinUserAccount.id
    );
    availableUserAccounts.push(...rest);
  }
  Cookie.set(
    AVAILABLE_USER_ACCOUNTS_COOKIE_KEY,
    JSON.stringify(availableUserAccounts),
    {
      path: '/',
      secure: true,
      sameSite: 'strict',
      expires: 7, // 有効期限は7日間
    }
  );
};

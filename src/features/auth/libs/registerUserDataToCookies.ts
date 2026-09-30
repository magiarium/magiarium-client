import Cookie from 'js-cookie';
import {
  AVAILABLE_ACCOUNTS_COOKIE_KEY,
  CURRENT_ACCOUNT_COOKIE_KEY,
} from '../constants';
import { AccountInfo } from '../type';

export const registerUserDataToCookies = (currentAccount: AccountInfo) => {
  // 権限ロールがGUESTの場合はCookieに保持しない
  if (currentAccount.role === 'GUEST') {
    Cookie.remove(CURRENT_ACCOUNT_COOKIE_KEY, {
      path: '/',
    });
    return;
  }

  // カレントアカウントを切り替え
  Cookie.set(CURRENT_ACCOUNT_COOKIE_KEY, JSON.stringify(currentAccount), {
    path: '/',
    secure: true,
    sameSite: 'strict',
    expires: 7, // 有効期限は7日間
  });

  // 利用可能アカウントリストも更新
  const availableAccountsCookie = Cookie.get(AVAILABLE_ACCOUNTS_COOKIE_KEY);
  const availableAccounts: AccountInfo[] = [currentAccount];
  if (availableAccountsCookie) {
    // 未登録ユーザーであれば、新規登録
    const rest = JSON.parse(availableAccountsCookie).filter(
      (targetAccount: AccountInfo) => targetAccount.id !== currentAccount.id
    );
    availableAccounts.push(...rest);
  }
  Cookie.set(AVAILABLE_ACCOUNTS_COOKIE_KEY, JSON.stringify(availableAccounts), {
    path: '/',
    secure: true,
    sameSite: 'strict',
    expires: 7, // 有効期限は7日間
  });
};

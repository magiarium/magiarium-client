import { AccountInfo } from './type';

// ゲストアカウント定義
export const GUEST_ACCOUNT: AccountInfo = {
  id: 'guest_user',
  name: 'ゲスト',
  role: 'GUEST',
};

export const CURRENT_ACCOUNT_COOKIE_KEY = 'current_account';
export const AVAILABLE_ACCOUNTS_COOKIE_KEY = 'available_accounts';

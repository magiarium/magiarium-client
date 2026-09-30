// ユーザーデータ
export type UserData = {
  currentAccount: AccountInfo;

  availableAccounts: AccountInfo[];
};

// アカウント権限ロール
const ACCOUNT_ROLES = {
  ADMIN: 'ADMIN', // 管理者
  DEMO: 'DEMO', // デモ
  GUEST: 'GUEST', //　ゲスト
} as const;
export type AccountRole = (typeof ACCOUNT_ROLES)[keyof typeof ACCOUNT_ROLES];

// アカウント情報
export type AccountInfo = {
  // アカウントID
  id: string;
  // アカウント名
  name: string;
  // 権限ロール
  role: AccountRole;
};

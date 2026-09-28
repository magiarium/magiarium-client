import { ImageMetadata } from '@magiarium/structure';

// ユーザーデータ
export type UserData = {
  currentUserAccount: UserAccountInfo;

  availableUserAccounts: UserAccountInfo[];
};

// ユーザーアカウント権限ロール
export const USER_ACCOUNT_ROLES = {
  ADMIN: 'ADMIN', // 管理者
  DEMO: 'DEMO', // デモ
  GUEST: 'GUEST', //　ゲスト
} as const;
export type UserAccountRole =
  (typeof USER_ACCOUNT_ROLES)[keyof typeof USER_ACCOUNT_ROLES];

// ユーザーアカウント情報
export type UserAccountInfo = {
  // アカウントID
  id: string;
  // アカウント名
  name: string;
  // アカウントアイコン
  icon: ImageMetadata;
  // 権限ロール
  role: UserAccountRole;
};

// ゲストアカウント
export const GUEST_USER_ACCOUNT: UserAccountInfo = {
  id: 'guest_user',
  name: 'ゲスト',
  icon: {
    path: '/assets/images/logo.svg',
    mimeType: 'image/svg',
    title: 'ユーザーアイコン',
    alt: 'ユーザーアイコン',
    attributes: {
      width: 515,
      height: 515,
    },
    uploadedAt: '202609260000000',
  },
  role: 'GUEST',
};

export const DEFAULT_USER_ACCOUNT_ICON: ImageMetadata = {
  path: '/assets/images/logo.svg',
  mimeType: 'image/svg',
  title: 'ユーザーアイコン',
  alt: 'ユーザーアイコン',
  attributes: {
    width: 515,
    height: 515,
  },
  uploadedAt: '202609260000000',
};

export const CURRENT_USER_ACCOUNT_COOKIE_KEY = 'current_user_account';
export const AVAILABLE_USER_ACCOUNTS_COOKIE_KEY = 'available_user_accounts';

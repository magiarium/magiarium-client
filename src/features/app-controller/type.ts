import { ReactNode } from 'react';

/** アプリケーションの状態 */
export type AppState = 'INITIAL' | 'LOCKED' | 'DEFAULT' | 'RESTART';

/** Notice種別 */
export type NoticeType = 'DEFAULT' | 'NOTICE' | 'ALERT' | 'WARN';

/** Notice設定 */
export type NoticeConfig = {
  // タイトル
  title: string;
  // Notice種別
  type: NoticeType;
  // コンテンツ
  children: ReactNode;
  // Closeアクション
  onClose?: () => void;
};

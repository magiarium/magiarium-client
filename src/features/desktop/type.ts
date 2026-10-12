import { ReactNode } from 'react';

/**
 * WindowControllerID
 */
export type WindowControllerId = string & {
  readonly __brand: 'WindowControllerId';
};

/**
 * Window設定
 */
export type WindowConfig = {
  /** WindowControllerID */
  id: WindowControllerId;
  /** タイトル */
  title: string;
  /** サブタイトル(任意) */
  subTitle?: string;
  /** Windowコンテンツ */
  children: ReactNode;
  /** 対象Windowに設定するパス */
  href?: string;
};

/** Windowの開閉状態 */
export type WindowState = 'CLOSED' | 'OPENED';

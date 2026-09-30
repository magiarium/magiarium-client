import { ReactNode } from 'react';
import './ErrorMessage.scss';

/**
 * エラーメッセージ
 * @param params.children 文字列
 * @returns Reactコンポーネント ※エラーメッセージが空の場合はnull
 */
export const ErrorMessage = ({ children }: { children: string }): ReactNode => {
  if (children === '') {
    return null;
  }

  return <div className="error-message">{children}</div>;
};

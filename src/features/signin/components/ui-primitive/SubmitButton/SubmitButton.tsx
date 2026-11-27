import { ReactNode } from 'react';
import './SubmitButton.scss';

/**
 * 送信ボタン
 *
 * @returns Reactコンポーネント
 */
export const SubmitButton = (): ReactNode => {
  return (
    <button type="submit" aria-label="サインイン" className="signin-button">
      <span aria-hidden="true">→</span>
    </button>
  );
};

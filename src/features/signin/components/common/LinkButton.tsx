import { ReactNode } from 'react';
import './LinkButton.scss';

/**
 * リンクボタン
 *
 * @param params.children　ボタンコンテンツ
 * @param params.onClick クリックアクション
 * @returns Reactコンポーネント
 */
export const LinkButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}): ReactNode => {
  return (
    <button className="link-button" onClick={onClick}>
      {children}
    </button>
  );
};

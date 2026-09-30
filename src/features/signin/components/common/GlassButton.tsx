import { ReactNode } from 'react';
import './GlassButton.scss';

/**
 * ガラス風ボタン
 *
 * @param params.children ボタン内コンテンツ
 * @param params.onClick クリック時アクション
 * @returns Reactコンポーネント
 */
export const GlassButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}): ReactNode => {
  return (
    <button className="glass-button" onClick={onClick}>
      {children}
    </button>
  );
};

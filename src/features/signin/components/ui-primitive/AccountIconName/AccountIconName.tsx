import { ReactNode } from 'react';
import './AccountIconName.scss';

/**
 * アカウント名
 *
 * @param params.children アカウント名
 * @returns Reactコンポーネント
 */
export const AccountIconName = ({
  children,
}: {
  children: string;
}): ReactNode => {
  return <span className="account-icon__name">{children}</span>;
};

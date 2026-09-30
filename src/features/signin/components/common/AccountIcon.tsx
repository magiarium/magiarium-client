import { ReactNode } from 'react';
import { AccountIconImage } from './AccountIcon.Image';
import { AccountIconName } from './AccountIcon.Name';
import './AccountIcon.scss';

/**
 * アカウントアイコン
 *
 * @param params.id アカウントID
 * @param params.name アカウント名
 * @returns Reactコンポーネント
 */
export const UserIcon = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): ReactNode => {
  return (
    <span className="account-icon">
      <AccountIconImage id={id} />
      <AccountIconName>{name}</AccountIconName>
    </span>
  );
};

import { AccountIconImage } from '@/features/signin/components/ui-primitive/AccountIconImage';
import { AccountIconName } from '@/features/signin/components/ui-primitive/AccountIconName';
import { ReactNode } from 'react';
import './AccountIcon.scss';

/**
 * アカウントアイコン
 *
 * @param params.id アカウントID
 * @param params.name アカウント名
 * @returns Reactコンポーネント
 */
export const AccountIcon = ({
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

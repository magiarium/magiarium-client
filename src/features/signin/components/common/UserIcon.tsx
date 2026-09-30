import { ImageMetadata } from '@magiarium/structure';
import { UNKNOWN_USER_ICON } from '../../define';
import { UserIconImage } from './UserIcon.Image';
import { UserIconName } from './UserIcon.Name';
import './UserIcon.scss';

/**
 * ユーザーアイコン
 * @param params.name ユーザー名
 * @param params.icon ユーザーアイコン画像
 * @returns Reactコンポーネント
 */
export const UserIcon = ({
  name,
  icon = UNKNOWN_USER_ICON,
}: {
  name: string;
  icon?: ImageMetadata;
}) => {
  return (
    <span className="user-icon">
      <UserIconImage icon={icon} />
      <UserIconName>{name}</UserIconName>
    </span>
  );
};

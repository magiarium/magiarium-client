import { ImageMetadata } from '@magiarium/structure';
import Image from 'next/image';
import './UserIcon.Image.scss';

/**
 * ユーザーアイコン画像
 * @param params.icon ユーザーアイコン画像情報
 * @returns Reactコンポーネント
 */
export const UserIconImage = ({ icon }: { icon: ImageMetadata }) => {
  return (
    <span className="user-icon__image">
      <Image
        src={icon.path}
        alt={icon.alt}
        width={icon.attributes.width}
        height={icon.attributes.height}
        loading="eager"
      />
    </span>
  );
};

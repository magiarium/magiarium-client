import { Image } from '@/common/components/Image';
import { ReactNode, useState } from 'react';
import './AccountIcon.Image.scss';

/**
 * アカウントアイコン画像
 *
 * @param params.id アカウントID
 * @returns Reactコンポーネント
 */
export const AccountIconImage = ({ id }: { id: string }): ReactNode => {
  const [src, setSrc] = useState(`/user/${id}/icon.webp`);

  return (
    <span className="account-icon__image">
      <Image
        src={src}
        alt={'アカウントアイコン'}
        width={515}
        height={515}
        loading="eager"
        onError={() => setSrc('/user/unknown/icon.webp')}
      />
    </span>
  );
};

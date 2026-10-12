import { useAppState } from '@/features/app-controller/hooks/useAppState';
import { useUserData } from '@/features/auth/hooks/useUserData';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, RefObject, useState } from 'react';
import {
  BsArrowClockwise,
  BsChevronRight,
  BsGear,
  BsLock,
} from 'react-icons/bs';
import { useWindowController } from '../hooks/useWindowController';
import { WindowControllerId } from '../type';
import './StartMenu.scss';

/**
 * スタートメニュー

 */
export const StartMenu = ({
  isView,
  ref,
}: {
  isView: boolean;
  ref?: RefObject<HTMLDivElement>;
}): ReactNode => {
  // 現在のユーザーアカウント
  const { currentAccount } = useUserData();
  // AppState
  const { setAppState } = useAppState();
  // 画面遷移用ルーター
  const router = useRouter();
  // 設定機能ウィンドウ登録用
  const { createWindowController } = useWindowController();
  // アカウントアイコンURL(エラー時はデフォルト画像を表示)
  const [src, setSrc] = useState(`/user/icons/${currentAccount.id}.webp`);

  return (
    <div
      ref={ref}
      className={classNames(
        'start-menu__content',
        isView && 'start-menu__content--active'
      )}
    >
      <div className="start-menu__account-info">
        <Image
          src={src}
          alt={'アカウントアイコン'}
          width={515}
          height={515}
          loading="eager"
          onError={() => setSrc('/user/icons/unknown.webp')}
        />
        現在のアカウント：{currentAccount.name}
      </div>
      <ul className="start-menu__list">
        <li>
          <button
            className="start-menu__button"
            onClick={() => {
              createWindowController({
                id: 'setting' as WindowControllerId,
                title: '設定',
                children: '現在、設定機能は解放されていません。',
              });
            }}
          >
            <BsGear />
            設定
            <BsChevronRight />
          </button>
        </li>
        <li>
          <Link href={'/signin'} className="start-menu__button">
            <BsLock />
            ロック
            <BsChevronRight />
          </Link>
        </li>
        <li>
          <button
            className="start-menu__button"
            onClick={() => {
              setAppState('RESTART');
              router.push('/');
            }}
          >
            <BsArrowClockwise />
            再起動
            <BsChevronRight />
          </button>
        </li>
      </ul>
    </div>
  );
};

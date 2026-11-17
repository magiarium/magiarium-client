import { BlogList } from '@/features/content/blog/components/BlogList';
import { useWindowManager } from '@/features/desktop/hooks/useWindowManager';
import { WindowControllerId } from '@/features/desktop/type';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import './GlobalNavigation.scss';

/**
 * グローバルナビゲーション
 *
 * ※デスクトップアイコン風
 */
export const GlobalNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasWindowController, windowControllers } = useWindowManager();
  return (
    <nav className="global-navigation">
      <ul className="global-navigation__list">
        {GLOBAL_NAVIGATION_LINKS.map((target) => {
          return (
            <li key={target.id}>
              <button
                className="global-navigation__link"
                onClick={() => {
                  if (pathname !== target.href) {
                    router.push(target.href);
                  }
                  if (hasWindowController(target.id)) {
                    const targetController = windowControllers.find(
                      (controller) => controller.id === target.id
                    );
                    targetController?.setWindowState('OPENED');
                    targetController?.onActive();
                  }
                }}
              >
                {target.icon}
                <span className="global-navigation__label">{target.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const GLOBAL_NAVIGATION_LINKS = [
  {
    id: 'blog-list' as WindowControllerId,
    href: '/blog',
    label: 'ブログ',
    content: <BlogList />,
    icon: (
      <Image
        className="global-navigation__icon"
        src={'/assets/images/blog-icon.svg'}
        alt={'ブログアイコン'}
        width={515}
        height={515}
      />
    ),
  },
];

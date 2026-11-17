import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useWindowManager } from '../hooks/useWindowManager';
import { WindowController } from '../libs/WindowController';
import './TaskbarButton.scss';

/**
 * タスクバーのウィンドウ開閉ボタン
 *
 * @param params.windowController WindowController
 */
export const TaskbarButton = ({
  windowController,
}: {
  windowController: WindowController;
}) => {
  const { activeWindowControllerId } = useWindowManager();
  const router = useRouter();

  return (
    <button
      className={classNames(
        'taskbar__button',
        activeWindowControllerId === windowController.id &&
          'taskbar__button--active'
      )}
      onClick={() => {
        const isOpen = windowController.getWindowState() === 'OPENED';
        if (isOpen && windowController.id === activeWindowControllerId) {
          windowController.setWindowState('CLOSED');
          windowController.onDisactive();
          return;
        }

        if (!isOpen) {
          windowController.setWindowState('OPENED');
        }

        windowController.onActive();
        if (windowController.href) {
          router.push(windowController.href);
        }
      }}
    >
      {windowController.title}
      {windowController.subTitle && ` - ${windowController.subTitle}`}
    </button>
  );
};

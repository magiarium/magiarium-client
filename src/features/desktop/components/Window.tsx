import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsDashLg, BsSquare, BsXLg } from 'react-icons/bs';
import { Rnd } from 'react-rnd';
import { useRndResize } from '../hooks/useRndResize';
import { useWindowManager } from '../hooks/useWindowManager';
import { WindowController } from '../libs/WindowController';
import { ContextMenu } from './ContextMenu';
import './Window.scss';

/**
 * Window
 *
 * @param params.windowController WindowControlller
 */
export const Window = ({
  windowController,
}: {
  windowController: WindowController;
}) => {
  const router = useRouter();
  // 最小化フラグ
  const [isMaximized, setIsMaximized] = useState(false);
  // アクティブ状態のWIndowControllerID
  const { activeWindowControllerId } = useWindowManager();
  // windowRef(サイズ&ポジション制御用)
  const { ref: windowRef } = useRndResize();

  if (!windowController || windowController.getWindowState() === 'CLOSED') {
    return;
  }

  const position = windowController.getPosition();
  const size = windowController.getSize();

  return (
    <>
      <Rnd
        className="window__container"
        ref={windowRef}
        default={{
          x: position.x,
          y: position.y,
          width: size.width,
          height: size.height,
        }}
        minWidth={300}
        minHeight={200}
        bounds="parent"
        dragHandleClassName="window__header"
        onMouseDown={() => {
          if (activeWindowControllerId !== windowController.id) {
            windowController.onActive();
            if (windowController.href) {
              router.push(windowController.href);
            }
          }
        }}
        onDragStop={(_e, d) => {
          windowController.setPosition({ x: d.x, y: d.y });
        }}
        onResizeStop={(_e, _d, ref) => {
          windowController.setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
        }}
      >
        <div className="window">
          <ContextMenu href={windowController.href}>
            <header className="window__header">
              <div className="window__title">
                <h2>{windowController.title}</h2>
                {windowController.subTitle && (
                  <h3>～{windowController.subTitle}～</h3>
                )}
              </div>
              <div className="window__actions">
                <button
                  type="button"
                  className="window__button"
                  onClick={() => {
                    windowController.setWindowState('CLOSED');
                    windowController.onDisactive();
                  }}
                >
                  <BsDashLg />
                </button>
                <button
                  type="button"
                  className="window__button"
                  onClick={() => {
                    const DEFAULT_WINDOW = {
                      x: position.x,
                      y: position.y,
                      width: size.width,
                      height: size.height,
                    };
                    if (isMaximized) {
                      windowRef.current?.updateSize({
                        width: DEFAULT_WINDOW.width,
                        height: DEFAULT_WINDOW.height,
                      });

                      windowRef.current?.updatePosition({
                        x: DEFAULT_WINDOW.x,
                        y: DEFAULT_WINDOW.y,
                      });
                    } else {
                      windowRef.current?.updateSize({
                        width: window.innerWidth,
                        height: window.innerHeight,
                      });

                      windowRef.current?.updatePosition({
                        x: 0,
                        y: 0,
                      });
                    }

                    setIsMaximized((prev) => !prev);
                    windowController.onActive();
                  }}
                >
                  <BsSquare />
                </button>
                <button
                  type="button"
                  className="window__button"
                  onClick={() => {
                    windowController.delete();
                    router.push('/');
                  }}
                >
                  <BsXLg />
                </button>
              </div>
            </header>
          </ContextMenu>
          <div className="window__content">{windowController.children}</div>
        </div>
      </Rnd>
    </>
  );
};

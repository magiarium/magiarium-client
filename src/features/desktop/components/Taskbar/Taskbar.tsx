'use client';
import { StartButton } from '@/features/desktop/components/StartButton/StartButton';
import { StartMenu } from '@/features/desktop/components/StartMenu/StartMenu';
import { TaskbarButton } from '@/features/desktop/components/TaskbarButton/TaskbarButton';
import { useWindowManager } from '@/features/desktop/hooks/useWindowManager';
import { WindowController } from '@/features/desktop/libs/WindowController';
import { useEffect, useRef, useState } from 'react';
import './Taskbar.scss';

/**
 * タスクバー
 */
export const Taskbar = () => {
  const { windowControllers } = useWindowManager();
  const [isOpenStartMenu, setIsOpenStartMenu] = useState<boolean>(false);

  // スタートメニューを開いている際、範囲外をクリックした場合に閉じる処理
  const menuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // スタートボタンのクリックでは閉じる処理を実行しない
      if (startButtonRef.current && startButtonRef.current.contains(target)) {
        return;
      }
      const isOutsideMenu =
        menuRef.current && !menuRef.current.contains(target);

      if (isOutsideMenu) {
        setIsOpenStartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="taskbar">
        <div ref={startButtonRef}>
          <StartButton
            onClick={() => {
              setIsOpenStartMenu((prev) => !prev);
            }}
          />
        </div>
        <ul className="taskbar__button-list">
          {windowControllers.map(
            (targetController: WindowController, index: number) => (
              <li key={`window-list-item-${index}`}>
                <TaskbarButton windowController={targetController} />
              </li>
            )
          )}
        </ul>
      </div>
      <StartMenu isView={isOpenStartMenu} ref={menuRef} />
    </>
  );
};

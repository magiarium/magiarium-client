import { GlobalNavigation } from '@/common/components/GlobalNavigation';
import { useAppState } from '@/features/app-controller/hooks/useAppState';
import { Taskbar } from '@/features/desktop/components/Taskbar';
import { Wallpaper } from '@/features/desktop/components/Wallpaper/Wallpaper';
import { Window } from '@/features/desktop/components/Window';
import { useWindowManager } from '@/features/desktop/hooks/useWindowManager';
import { ReactNode, useMemo } from 'react';
import './WindowScreen.scss';

/**
 * Windowスクリーン
 */
export const WindowScreen = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  // 並び順によって表示ウィンドウ一覧を作成
  const { windowOrder, windowControllers } = useWindowManager();
  const viewWindows = useMemo(() => {
    const orderMap = new Map(windowOrder.map((id, index) => [id, index]));

    return [...windowControllers].sort((a, b) => {
      const indexA = orderMap.get(a.id) ?? Infinity;
      const indexB = orderMap.get(b.id) ?? Infinity;

      return indexA - indexB;
    });
  }, [windowOrder.toString()]);

  // 初期表示 or ロック状態の場合、childrenのみ描画
  const { appState } = useAppState();
  if (appState === 'INITIAL' || appState === 'LOCKED') {
    return children;
  }

  return (
    <div className="window-screen">
      <Wallpaper />
      <div className="window-screen__content">
        <GlobalNavigation />
        {viewWindows.map((targetController) => (
          <Window
            key={targetController.id}
            windowController={targetController}
          />
        ))}
        {children}
      </div>
      <footer className="window-screen__footer">
        <Taskbar />
      </footer>
    </div>
  );
};

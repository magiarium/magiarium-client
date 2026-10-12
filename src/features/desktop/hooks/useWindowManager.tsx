import { useContext, useMemo, useSyncExternalStore } from 'react';
import { WindowContext } from '../contexts/WindowContext';

export const useWindowManager = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('WindowContextを初期化してください。');
  }

  useSyncExternalStore(
    context.subscribe,
    context.getSnapshot,
    context.getServerSnapShot
  );

  const { getWindowControllerAll, hasWindowController } = context;

  // Windowの重ね順から、現在アクティブ状態のWindowControllerIDを取得する
  const windowOrder = context.getWindowOrder();
  const activeWindowControllerId = useMemo(() => {
    return windowOrder[windowOrder.length - 1];
  }, [windowOrder.toString()]);

  return {
    activeWindowControllerId,
    windowControllers: getWindowControllerAll(),
    hasWindowController,
    windowOrder: windowOrder,
  };
};

import { useContext, useSyncExternalStore } from 'react';
import { WindowContext } from '../contexts/WindowContext';

export const useWindowController = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('WindowContextを初期化してください。');
  }

  useSyncExternalStore(
    context.subscribe,
    context.getSnapshot,
    context.getServerSnapShot
  );

  const { createWindowController } = context;

  return {
    createWindowController,
  };
};

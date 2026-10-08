import { useContext, useSyncExternalStore } from 'react';
import { ApplicationContext } from '../contexts/ApplicationContext';

export const useAppState = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('ApplicationContextを初期化してください。');
  }

  useSyncExternalStore(
    context.subscribe,
    context.getSnapshot,
    context.getServerSnapShot
  );

  return {
    appState: context.getAppState(),
    setAppState: context.setAppState,
  };
};

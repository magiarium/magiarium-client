import { useContext, useSyncExternalStore } from 'react';
import { ApplicationContext } from '../contexts/ApplicationContext';

export const useNotice = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('ApplicationContextを初期化してください。');
  }

  useSyncExternalStore(
    context.subscribe,
    context.getSnapshot,
    context.getServerSnapShot
  );

  const { getNotice, setNotice, closeNotice } = context;

  return {
    notice: getNotice(),
    setNotice,
    closeNotice,
  };
};

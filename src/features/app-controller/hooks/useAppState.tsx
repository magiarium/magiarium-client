import { useContext } from 'react';
import { ApplicationContext } from '../contexts/ApplicationContext';

export const useAppState = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('ApplicationContextを初期化してください。');
  }

  return {
    appState: context.getAppState(),
    setAppState: context.setAppState,
  };
};

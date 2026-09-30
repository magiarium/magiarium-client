'use client';
import { useContext } from 'react';
import { UserDataManagerContext } from '../contexts/UserDataManagerContext';

export const useUserData = () => {
  const context = useContext(UserDataManagerContext);

  if (!context) {
    throw new Error('UserDataManagerContextを初期化してください。');
  }

  const userDataManager = context;

  return {
    changeCurrentAccount: userDataManager.changeCurrentAccount,
    currentAccount: userDataManager.getCurrentAccount(),
    curretnAccountRole: userDataManager.getCurrentRole(),
    availableAccounts: userDataManager.getAvailableAccounts(),
  };
};

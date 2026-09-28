'use client';
import { useContext } from 'react';
import { UserDataManagerContext } from '../contexts/UserDataManagerContext';

export const useUserAccount = () => {
  const context = useContext(UserDataManagerContext);

  if (!context) {
    throw new Error('UserDataManagerContextを初期化してください。');
  }

  const userDataManager = context;

  return {
    signin: userDataManager.signin,
    currentAccount: userDataManager.getCurrentAccount(),
    availableAccounts: userDataManager.getAvailableAccounts(),
    userRole: userDataManager.getRole(),
  };
};

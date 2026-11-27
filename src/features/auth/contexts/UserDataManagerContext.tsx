'use client';
import { createContext, ReactNode, useState } from 'react';
import { UserDataManager } from '../libs/UserDataManager';
import { UserData } from '../type';

const UserDataManagerContext = createContext<UserDataManager | null>(null);

const UserDataManagerContextProvider = ({
  children,
  userData,
}: {
  children: ReactNode;
  userData: UserData;
}) => {
  // Providerのライフサイクル中は同じインスタンスを使用
  const [userDataManager] = useState(() => new UserDataManager(userData));

  return (
    <UserDataManagerContext.Provider value={userDataManager}>
      {children}
    </UserDataManagerContext.Provider>
  );
};

export { UserDataManagerContext, UserDataManagerContextProvider };

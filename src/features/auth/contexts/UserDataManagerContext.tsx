'use client';
import { Amplify } from 'aws-amplify';
import { createContext, ReactNode, useState } from 'react';
import { amplifyConfig } from '../libs/amplifyConfig';
import { UserDataManager } from '../libs/UserDataManager';
import { UserData } from '../type';

Amplify.configure(amplifyConfig, {
  ssr: true, // これを消すとセッションが切れたタイミングでサーバー側の認証だけ失敗するので消さないで
});

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

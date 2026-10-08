'use client';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { createContext, ReactNode, useState } from 'react';
import { amplifyConfig } from '../libs/amplifyConfig';
import { UserDataManager } from '../libs/UserDataManager';
import { UserData } from '../type';

Amplify.configure(amplifyConfig);

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
    <Authenticator.Provider>
      <UserDataManagerContext.Provider value={userDataManager}>
        {children}
      </UserDataManagerContext.Provider>
    </Authenticator.Provider>
  );
};

export { UserDataManagerContext, UserDataManagerContextProvider };

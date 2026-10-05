'use client';
import {
  createContext,
  ReactNode,
  useState,
  useSyncExternalStore,
} from 'react';
import { Application } from '../libs/Application';

const ApplicationContext = createContext<Application | null>(null);

const ApplicationContextProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  // Providerのライフサイクル中は同じインスタンスを使用
  const [application] = useState(() => new Application());

  useSyncExternalStore(
    application.subscribe,
    application.getSnapshot,
    application.getServerSnapShot
  );

  return (
    <ApplicationContext.Provider value={application}>
      {children}
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationContextProvider };

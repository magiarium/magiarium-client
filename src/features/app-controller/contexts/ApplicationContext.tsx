'use client';
import { createContext, ReactNode, useState } from 'react';
import { Notice } from '../components/Notice';
import { Application } from '../libs/Application';

const ApplicationContext = createContext<Application | null>(null);

const ApplicationContextProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  // Providerのライフサイクル中は同じインスタンスを使用
  const [application] = useState(() => new Application());

  return (
    <ApplicationContext.Provider value={application}>
      {children}
      <Notice />
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationContextProvider };

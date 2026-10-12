'use client';
import { createContext, ReactNode, useState } from 'react';
import { WindowScreen } from '../components/WindowScreen';
import { WindowControllerManager } from '../libs/WindowManager';

const WindowContext = createContext<WindowControllerManager | null>(null);

const WindowContextProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const [windowControllerManager] = useState(
    () => new WindowControllerManager()
  );

  return (
    <WindowContext.Provider value={windowControllerManager}>
      <WindowScreen>{children}</WindowScreen>
    </WindowContext.Provider>
  );
};

export { WindowContext, WindowContextProvider };

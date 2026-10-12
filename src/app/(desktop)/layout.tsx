'use client';

import { useAppState } from '@/features/app-controller/hooks/useAppState';
import { ReactNode, useEffect } from 'react';

const DesktopLayout = ({ children }: { children: ReactNode }): ReactNode => {
  const { appState, setAppState } = useAppState();

  useEffect(() => {
    if (appState === 'INITIAL' || appState === 'LOCKED') {
      setAppState('READY');
    }
  }, []);

  return children;
};
export default DesktopLayout;

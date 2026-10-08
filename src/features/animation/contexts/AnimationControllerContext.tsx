'use client';
import { createContext, ReactNode, useState } from 'react';
import { AnimationControllerManager } from '../libs/manager/AnimationControllerManager';

const AnimationControllerContext =
  createContext<AnimationControllerManager | null>(null);

const AnimationControllerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [animationControllerManager] = useState(
    () => new AnimationControllerManager()
  );

  return (
    <AnimationControllerContext.Provider value={animationControllerManager}>
      {children}
    </AnimationControllerContext.Provider>
  );
};

export { AnimationControllerContext, AnimationControllerContextProvider };

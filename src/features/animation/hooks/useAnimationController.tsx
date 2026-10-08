import { useContext, useSyncExternalStore } from 'react';
import { AnimationControllerContext } from '../contexts/AnimationControllerContext';

export const useAnimationController = () => {
  const context = useContext(AnimationControllerContext);
  if (!context) {
    throw new Error('AnimationControllerContextを初期化しました。');
  }

  useSyncExternalStore(
    context.subscribe,
    context.getSnapshot,
    context.getServerSnapShot
  );

  const {
    registerAnimationController,
    startAnimationController,
    finishAnimationController,
    destroyAnimationController,
    deleteAnimationController,
    getAnimationControllerState,
    getAnimationController,
  } = context;

  return {
    startAnimationController,
    finishAnimationController,
    destroyAnimationController,
    registerAnimationController,
    deleteAnimationController,
    getAnimationControllerState,
    getAnimationController,
  };
};

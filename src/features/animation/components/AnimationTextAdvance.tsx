'use client';
import { useEffect, useRef } from 'react';
import { useAnimationController } from '../hooks/useAnimationController';
import { AnimatorId } from '../libs/animator/type';
import { createAnimationController } from '../libs/factory/createAnimationController';

/**
 * テキストアドバンスアニメーション
 *
 * @returns テキストアドバンスアニメーション
 */
export const AnimationTextAdvance = () => {
  const ref = useRef<HTMLSpanElement>(null);
  const { registerAnimationController, deleteAnimationController } =
    useAnimationController();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const animationController = createAnimationController({
      controllerType: 'SIMPLE',
      element: ref.current,
      playConfig: { type: 'INFINITE' },
      animator: {
        id: 'text-advance' as AnimatorId,
        type: 'MOTION',
        keyframes: { opacity: [0, 1] },
        options: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      },
    });
    registerAnimationController(animationController);
    animationController.start();

    return () => {
      deleteAnimationController(animationController.getId());
      animationController.destroy();
    };
  }, []);

  return <span ref={ref}>▼</span>;
};

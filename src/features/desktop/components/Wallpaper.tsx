import { useAnimationController } from '@/features/animation/hooks/useAnimationController';
import { AnimatorId } from '@/features/animation/libs/animator/type';
import { createAnimationController } from '@/features/animation/libs/factory/createAnimationController';
import { useEffect, useRef } from 'react';
import './Wallpaper.scss';

/**
 * 背景
 */
export const Wallpaper = () => {
  // タイトルアニメーションをループさせる処理
  const { registerAnimationController, deleteAnimationController } =
    useAnimationController();
  const wallpaperRef = useRef<HTMLDivElement>(null);
  const animationWaitRef = useRef<boolean>(false);
  useEffect(() => {
    if (!wallpaperRef.current || animationWaitRef.current) {
      return;
    }
    const animationController = createAnimationController({
      id: 'wallpaper-animation',
      controllerType: 'SIMPLE',
      element: wallpaperRef.current,
      playConfig: { type: 'ONCE' },
      animator: {
        id: 'title-animation' as AnimatorId,
        type: 'LOTTIE',
        src: './assets/animations/title_draw_animation.json',
        speed: 0.5,
      },
      completeAction: () => {
        if (animationWaitRef.current) {
          return;
        }
        animationWaitRef.current = true;
        animationController.pause();
        setTimeout(() => {
          animationWaitRef.current = false;
          animationController.reset();
          animationController.start();
        }, 2000);
      },
    });
    registerAnimationController(animationController);
    animationController.start();
    return () => {
      deleteAnimationController(animationController.getId());
      animationController.destroy();
    };
  }, []);

  return <div className="wallpaper" ref={wallpaperRef}></div>;
};

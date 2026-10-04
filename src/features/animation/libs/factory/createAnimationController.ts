import { Animator } from '../animator/type';
import { AnimationController } from '../controller/AnimationController';
import { ChainAnimationController } from '../controller/CustomAnimationController/internal/ChainAnimationController';
import { ParalellAnimationController } from '../controller/CustomAnimationController/internal/ParalellAnimationController';
import { LottieAnimationController } from '../controller/SimpleAnimationController/internal/LottieAnimationController';
import { MotionAnimationController } from '../controller/SimpleAnimationController/internal/MotionAnimationController';
import { PlayConfig } from '../controller/type';

export type AnimationConfig =
  | {
      controllerType: 'CHAIN' | 'PARALLEL';
      playConfig: PlayConfig;
      children: AnimationConfig[];
      completeAction?: () => void;
      initializeAction?: () => void;
    }
  | {
      controllerType: 'SIMPLE';
      playConfig: PlayConfig;
      element: HTMLElement;
      animator: Animator;
      completeAction?: () => void;
      initializeAction?: () => void;
    };

/**
 * AnimationController作成処理
 * @param animationConfig AnimationController設定
 * @returns AnimationController
 */
export const createAnimationController = (
  animationConfig: AnimationConfig
): AnimationController => {
  switch (animationConfig.controllerType) {
    case 'SIMPLE':
      switch (animationConfig.animator.type) {
        case 'LOTTIE':
          return new LottieAnimationController({
            element: animationConfig.element,
            animator: animationConfig.animator,
            completeAction: animationConfig.completeAction,
            initializeAction: animationConfig.initializeAction,
            playConfig: animationConfig.playConfig,
          });
        case 'MOTION':
          return new MotionAnimationController({
            element: animationConfig.element,
            animator: animationConfig.animator,
            completeAction: animationConfig.completeAction,
            initializeAction: animationConfig.initializeAction,
            playConfig: animationConfig.playConfig,
          });
      }
    case 'CHAIN': {
      return new ChainAnimationController({
        children: animationConfig.children.map((childDefine) => {
          return createAnimationController(childDefine);
        }),
        playConfig: animationConfig.playConfig,
        completeAction: animationConfig.completeAction,
        initializeAction: animationConfig.initializeAction,
      });
    }
    case 'PARALLEL': {
      return new ParalellAnimationController({
        children: animationConfig.children.map((childDefine) => {
          return createAnimationController(childDefine);
        }),
        playConfig: animationConfig.playConfig,
        completeAction: animationConfig.completeAction,
        initializeAction: animationConfig.initializeAction,
      });
    }
  }
};

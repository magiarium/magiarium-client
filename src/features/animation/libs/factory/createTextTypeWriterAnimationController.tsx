import { toVisibleAnimator } from '../animator/assets/toVisibleAnimator';
import { PlayConfig } from '../controller/type';
import {
  AnimationConfig,
  createAnimationController,
} from './createAnimationController';

/**
 * TextTypeWriterAnimationController作成処理
 *
 * @param params.id コントローラーID(強制指定時のみ指定)
 * @param params.element 対象HTMLエレメント
 * @param params.playConfig 再生設定
 * @param params.typeMode タイピングモード(`SEQUENTIAL`=上から順番に実行、`PARALLEL`=行内の文字は順列、行単位は並列)
 * @param params.speed 1文字あたりの表示時間
 * @param params.completeAction アニメーション完了アクション
 * @returns AnimationController
 */
export const createTypeWriterAnimationController = ({
  id,
  element,
  playConfig,
  typeMode,
  speed,
  onComplete,
}: {
  id?: string;
  element: HTMLElement;
  playConfig?: PlayConfig;
  typeMode?: 'SEQUENTIAL' | 'PARALLEL';
  speed?: number;
  onComplete?: () => void;
}) => {
  const animationConfig = createTypeWriterAnimationConfigs({
    element,
    playConfig,
    typeMode,
    speed,
    onComplete,
  });

  return createAnimationController({ id, ...animationConfig });
};
/**
 * TextTypeWriterAnimationController作成処理
 *
 * @param params.element 対象HTMLエレメント
 * @param params.playConfig 再生設定
 * @param params.typeMode タイピングモード(`SEQUENTIAL`=上から順番に実行、`PARALLEL`=行内の文字は順列、行単位は並列)
 * @param params.speed 1文字あたりの表示時間
 * @param params.completeAction アニメーション完了アクション
 * @returns AnimationConfig
 */
export const createTypeWriterAnimationConfigs = ({
  element,
  playConfig = { type: 'ONCE' },
  typeMode = 'SEQUENTIAL',
  speed = 0.1,
  onComplete,
}: {
  element: HTMLElement;
  playConfig?: PlayConfig;
  typeMode?: 'SEQUENTIAL' | 'PARALLEL';
  speed?: number;
  onComplete?: () => void;
}): AnimationConfig => {
  const paragraphAnimationControllerConfig: AnimationConfig[] = [];
  const spanAnimationControllerConfig: AnimationConfig[] = [];
  const toVisibleElements: HTMLElement[] = [];

  Array.from(element.children).forEach((targetChild) => {
    if (targetChild instanceof HTMLSpanElement) {
      toVisibleElements.push(targetChild);
      spanAnimationControllerConfig.push({
        controllerType: 'SIMPLE',
        element: targetChild,
        playConfig: { type: 'ONCE' },
        animator: toVisibleAnimator({ duration: speed }),
      });
    } else if (targetChild instanceof HTMLElement) {
      if (spanAnimationControllerConfig.length > 0) {
        paragraphAnimationControllerConfig.push({
          controllerType: 'CHAIN',
          playConfig: { type: 'ONCE' },
          children: [...spanAnimationControllerConfig],
        });
        spanAnimationControllerConfig.length = 0;
      }
      paragraphAnimationControllerConfig.push(
        createTypeWriterAnimationConfigs({
          element: targetChild,
          typeMode,
          speed,
          onComplete,
        })
      );
    }
  });

  if (spanAnimationControllerConfig.length > 0) {
    paragraphAnimationControllerConfig.push({
      controllerType: 'CHAIN',
      playConfig: { type: 'ONCE' },
      children: [...spanAnimationControllerConfig],
    });
  }

  const initializeAction = () => {
    for (const targetElement of toVisibleElements) {
      targetElement.style.opacity = '0';
    }
  };

  if (paragraphAnimationControllerConfig.length === 1) {
    const childConfig = paragraphAnimationControllerConfig[0];

    return {
      ...childConfig,
      playConfig,
      initializeAction: () => {
        initializeAction();

        if (childConfig.initializeAction) {
          childConfig.initializeAction();
        }
      },
      completeAction: onComplete,
    };
  }

  if (typeMode === 'PARALLEL') {
    return {
      controllerType: 'PARALLEL',
      playConfig: playConfig,
      children: paragraphAnimationControllerConfig,
      initializeAction,
      completeAction: onComplete,
    };
  } else {
    return {
      controllerType: 'CHAIN',
      playConfig: playConfig,
      children: paragraphAnimationControllerConfig,
      initializeAction,
      completeAction: onComplete,
    };
  }
};

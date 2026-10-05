import { toVisibleAnimator } from '../animator/assets/toVisibleAnimator';
import { AnimationController } from '../controller/AnimationController';
import { PlayConfig } from '../controller/type';
import {
  AnimationConfig,
  createAnimationController,
} from './createAnimationController';

/**
 * 対象配下のdata-animation-duration定義が付与された全エレメントに対して、フェードインアニメーションを順次実行するアニメーションコントローラーを作成する
 *
 * 詳細仕様は`createWaterfallRenderAnimationConfig`を参照
 *
 * @param params.element 対象HTMLエレメント
 * @param params.playConfig 再生設定
 * @param params.completeAction アニメーション完了アクション
 * @returns アニメーションコントローラー
 */
export const createToVisibleChainAnimationController = ({
  element,
  playConfig,
  completeAction,
}: {
  element: HTMLElement;
  playConfig?: PlayConfig;
  completeAction?: () => void;
}): AnimationController => {
  const toVisibleChainAnimationConfig = createToVisibleChainAnimationConfig({
    element,
    playConfig,
    completeAction,
  });

  return createAnimationController(toVisibleChainAnimationConfig);
};

/**
 * 対象配下のdata-animation-duration定義が付与された全エレメントに対して、フェードインアニメーションを順次実行するアニメーション設定を作成する
 *
 *  * 【取り扱い対象data-set】
 *
 * ・data-animation-duration: 引数のHTMLに付与することで、対象エレメントの表示速度を指定可能
 *
 * ・data-animation-delay: 引数のHTMLに付与することで、対象エレメントのdelayを指定可能
 *
 * ・data-animation-state: この関数内で自動的に付与。`pending`:アニメーションコントローラー登録済み、`complete`:アニメーション完了済み
 *
 * @param params.element 対象HTMLエレメント
 * @param params.playConfig 再生設定
 * @param params.completeAction アニメーション完了アクション
 * @returns アニメーション設定
 */
export const createToVisibleChainAnimationConfig = ({
  element,
  playConfig = { type: 'ONCE' },
  completeAction,
}: {
  element: HTMLElement;
  playConfig?: PlayConfig;
  completeAction?: () => void;
}): AnimationConfig => {
  const toVisibleElementAnimationConfigs: AnimationConfig[] = [];
  const toVisibleElements: HTMLElement[] = [];
  Array.from(element.children).forEach((targetChild) => {
    if (targetChild instanceof HTMLElement) {
      if (targetChild.dataset.animationDuration !== undefined) {
        toVisibleElements.push(targetChild);
        targetChild.dataset.animationState = 'pending';
        toVisibleElementAnimationConfigs.push({
          controllerType: 'SIMPLE',
          element: targetChild,
          playConfig: { type: 'ONCE' },
          animator: toVisibleAnimator({
            duration: Number(targetChild.dataset.animationDuration),
            delay: Number(targetChild.dataset.animationDelay),
          }),
          completeAction: () => {
            targetChild.dataset.animationState = 'complete';
          },
        });
      }
      // 子要素に対しても再起処理を実施する
      const resultConfig = createToVisibleChainAnimationConfig({
        element: targetChild,
      });
      if (
        resultConfig.controllerType !== 'SIMPLE' &&
        resultConfig.children.length !== 0
      ) {
        toVisibleElementAnimationConfigs.push(resultConfig);
      }
    }
  });

  const initializeAction = () => {
    for (const targetElement of toVisibleElements) {
      targetElement.style.opacity = '0';
    }
  };

  return {
    controllerType: 'CHAIN',
    children: toVisibleElementAnimationConfigs,
    playConfig: playConfig,
    completeAction,
    initializeAction,
  };
};

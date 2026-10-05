import { AnimationController } from '../libs/controller/AnimationController';
import './AnimationSkipOverlay.scss';

/**
 * アニメーションスキップオーバーレイ
 *
 * @param params.animationController スキップ対象アニメーションコントローラー
 * @returns Reactコンポーネント
 */
export const AnimationSkipOverlay = ({
  animationController,
}: {
  animationController?: AnimationController;
}) => {
  return (
    <div
      className="animation-skip-overlay"
      onClick={() => {
        console.log('CLICK!!');
        animationController?.finish();
      }}
    />
  );
};

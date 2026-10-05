import { Animator, AnimatorId } from '../type';

/**
 * `opacity`を`0`→`1`にするフェードイン用アニメーター
 *
 * @param params.duration 再生時間
 * @returns フェードイン演出用のアニメーター
 */
export const toVisibleAnimator = ({
  duration,
  delay,
}: {
  duration?: number;
  delay?: number;
}): Animator<'MOTION'> => {
  return {
    type: 'MOTION',
    id: 'to-visible-effect' as AnimatorId,
    keyframes: {
      opacity: [0, 1],
    },
    options: {
      ...(Number.isFinite(duration) && { duration }),
      ...(Number.isFinite(delay) && { delay }),
    },
  };
};

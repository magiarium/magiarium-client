import { animate } from 'motion';

/** アニメーターID */
export type AnimatorId = string & {
  readonly __brand: 'AnimatorId';
};

/** アニメーター種別 */
export type AnimatorType = 'MOTION' | 'LOTTIE';

/** MotionKeyframesパラメータ */
export type MotionKeyframes = Parameters<typeof animate>[1];

/** MotionOptionsパラメータ */
export type MotionOptions = Parameters<typeof animate>[2];

/** アニメーター定義 */
type AnimatorDefinition =
  | {
      type: 'MOTION';
      keyframes: MotionKeyframes;
      options?: MotionOptions;
    }
  | {
      type: 'LOTTIE';
      src: string;
    };

/** アニメーター型 */
export type Animator<T extends AnimatorType = AnimatorType> = {
  id: AnimatorId;
} & Extract<AnimatorDefinition, { type: T }>;

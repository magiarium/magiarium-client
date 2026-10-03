import { Selector } from '@/common/libs/getSelector';
import { AnimatorId } from '../animator/type';

/**
 * アニメーションコントローラーID
 *
 * ※.デバッグ時の識別用途ため、現状『アニメーション対象エレメントのセレクタ+アニメーターID』をcyrb53でハッシュ化した値を採用
 */
export type AnimationControllerId = string & {
  readonly __brand: 'AnimationControllerId';
};

/**
 * アニメーションコントローラーの状態値
 *
 * ・PENDING: 初期状態
 *
 * ・RUNNING: 再生状態
 *
 * ・PAUSED: 停止状態
 *
 * ・FINISHED: 完了状態
 *
 * ・DESTROYED: 破棄済み
 */
export type AnimationControllerState =
  'PENDING' | 'RUNNING' | 'PAUSED' | 'FINISHED' | 'DESTROYED';

/**
 * アニメーションの再生種別
 *
 * ・ONCE: 1回のみ再生する
 *
 * ・INFINITE: 無限に繰り返し再生する
 *
 * ・LOOP: 指定回数だけ繰り返し再生する
 */
export type PlayType = 'ONCE' | 'INFINITE' | 'LOOP';

/**
 * アニメーション再生設定(各コントローラー作成時の引数でのみ利用。コントローラー内部ではPlayStateを利用)
 */
export type PlayConfig<T extends PlayType = PlayType> = {
  ONCE: { type: 'ONCE' };
  INFINITE: { type: 'INFINITE' };
  LOOP: { type: 'LOOP'; totalCount: number };
}[T];

/**
 * アニメーション再生状態
 */
export type PlayState<T extends PlayType = PlayType> = {
  ONCE: { type: 'ONCE'; progress: ProgressNumber };
  INFINITE: { type: 'INFINITE'; progress: ProgressNumber };
  LOOP: {
    type: 'LOOP';
    totalCount: number;
    currentCount: number;
    progress: ProgressNumber;
  };
}[T];

/**
 * アニメーション進捗度
 *
 *  0 <= progress <= 1
 */
export type ProgressNumber = number;

/**
 * アニメーションコントローラーごとの各種パラメーター
 */
export type AnimationControllerParams =
  SimpleAnimationControllerParams | CustomAnimationControllerParams;

/**
 * アニメーションコントローラーごとの基本パラメーター
 */
type AnimationControllerParamsBase = {
  /** コントローラーID */
  controllerId: AnimationControllerId;

  /** コントローラー状態 */
  controllerState: AnimationControllerState;

  /** セレクタ一覧 */
  usedSelector: Selector[];

  /** アニメーション再生状態 */
  playState: PlayState;
};

/**
 * アニメーションコントローラーごとの各種パラメーター(SimpleController用)
 */
type SimpleAnimationControllerParams = AnimationControllerParamsBase & {
  /** アニメーターID */
  animatorId: AnimatorId;
};

/**
 * アニメーションコントローラーごとの各種パラメーター(CustomController用)
 */
type CustomAnimationControllerParams = AnimationControllerParamsBase & {
  /** 子コントローラーパラメータ */
  children: AnimationControllerParams[];
};

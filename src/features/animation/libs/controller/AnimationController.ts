import { AnimationControllerId, AnimationControllerParams } from './type';

/**
 * アニメーションコントローラー インターフェース
 *
 * アニメーションの再生状態を管理し、開始・一時停止・リセット・完了・破棄などのライフサイクル制御を提供する
 */
export interface AnimationController {
  /**
   * アニメーションコントローラーIDを取得する
   *
   * @returns アニメーションコントローラーID
   */
  getId(): AnimationControllerId;

  /**
   * アニメーションを開始する。
   *
   * 一時停止中の場合は、現在の再生位置から再開する。
   *
   * @returns アニメーションの開始処理が完了したときに解決するPromise
   */
  start(): Promise<void>;

  /**
   * アニメーションを一時停止する。
   *
   * 現在の再生位置を維持したまま一時停止する。
   */
  pause(): void;

  /**
   * アニメーションを初期状態に戻す。
   */
  reset(): void;

  /**
   * アニメーションを完了状態にする。
   *
   * アニメーションを終了位置まで進め、完了時の処理を実行する。
   */
  finish(): void;

  /**
   * アニメーションコントローラーを破棄する。
   *
   * アニメーションの停止、イベントリスナーの解除、および内部リソースの解放などを行う。
   *
   * 破棄によってアニメーションが完了したものとはみなさず、完了時の処理は実行しない。
   */
  destroy(): void;

  /**
   * コントローラーパラメータを取得する
   *
   * @returns 現在のアニメーション状態
   */
  getParams(): AnimationControllerParams;
}

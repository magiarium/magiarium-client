import lottie, { AnimationItem } from 'lottie-web';
import { BaseSimpleAnimationController } from '../BaseSimpleAnimationController';
/**
 * アニメーターにLottieを使用するコントローラーのクラス
 */
export class LottieAnimationController extends BaseSimpleAnimationController<'LOTTIE'> {
  private _lottieController: AnimationItem = (() => {
    const controller = lottie.loadAnimation({
      container: this._element,
      path: this._animator.src,
      loop:
        this._playState.type === 'INFINITE'
          ? true
          : this._playState.type === 'LOOP'
            ? this._playState.totalCount
            : false,
    });
    controller.addEventListener('enterFrame', () =>
      this._updateProgress(controller.currentFrame / controller.totalFrames)
    );
    return controller;
  })();

  async start(): Promise<void> {
    // StateをRUNNING状態に更新
    this._updateControllerState('RUNNING');

    await new Promise<void>((resolve) => {
      // 完了アクションを設定
      this._lottieController?.addEventListener('complete', () => {
        this._onComplete();
        resolve();
      });

      this._lottieController?.play();
    });
  }

  reset() {
    this._lottieController?.stop();
    super.reset();
  }

  pause() {
    if (this._controllerState === 'RUNNING') {
      this._lottieController?.pause();
      this._updateControllerState('PAUSED');
    }
  }

  finish() {
    this._lottieController?.goToAndStop(
      this._lottieController.totalFrames - 1,
      true
    );
    super.finish();
  }

  destroy() {
    this._lottieController?.destroy();
    this._updateControllerState('DESTROYED');
  }
}

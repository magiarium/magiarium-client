import lottie, { AnimationItem } from 'lottie-web';
import { BaseSimpleAnimationController } from '../BaseSimpleAnimationController';

export class LottieAnimationController extends BaseSimpleAnimationController<'LOTTIE'> {
  private _lottieController: AnimationItem | null = null;

  start = async (): Promise<void> => {
    if (this._lottieController === null) {
      const controller = lottie.loadAnimation({
        container: this._element,
        path: this._animator.src,
        loop: (() => {
          switch (this._playState.type) {
            case 'INFINITE':
              return true;
            case 'LOOP':
              return this._playState.totalCount;
            case 'ONCE':
              return false;
          }
        })(),
      });
      controller.addEventListener('enterFrame', () => {
        this._updateProgress(controller.currentFrame / controller.totalFrames);
      });
      this._lottieController = controller;
    }

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
  };

  reset = () => {
    this._lottieController?.destroy();
    this._updateControllerState('PENDING');
  };

  pause = () => {
    if (this._controllerState === 'RUNNING') {
      this._lottieController?.pause();
      this._updateControllerState('PAUSED');
    }
  };

  finish = () => {
    this._lottieController?.goToAndStop(this._lottieController.totalFrames);
    this._onComplete();
  };

  destroy = () => {
    this._lottieController?.destroy();
    this._updateControllerState('DESTROYED');
  };
}

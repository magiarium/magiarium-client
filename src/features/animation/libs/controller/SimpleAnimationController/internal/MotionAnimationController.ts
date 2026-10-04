import { animate, AnimationPlaybackControlsWithThen } from 'motion';
import { BaseSimpleAnimationController } from '../BaseSimpleAnimationController';

export class MotionAnimationController extends BaseSimpleAnimationController<'MOTION'> {
  private _motionController: AnimationPlaybackControlsWithThen = animate(
    this._element,
    this._animator.keyframes,
    {
      ...this._animator.options,
      onUpdate: () => {
        const duration = this._motionController!.duration;
        const progress =
          duration > 0 ? this._motionController!.time / duration : 1;

        this._updateProgress(Math.min(progress, 1)); // 閾値オーバー時はここで丸め込む
      },
      repeat: (() => {
        switch (this._playState.type) {
          case 'INFINITE':
            return Infinity;
          case 'LOOP':
            return this._playState.totalCount - 1;
          case 'ONCE':
            return undefined;
        }
      })(),
      onComplete: () => {
        this._onComplete();
      },
    }
  );

  async start(): Promise<void> {
    this._motionController.play();
    this._updateControllerState('RUNNING');

    await this._motionController.finished;
  }

  reset(): void {
    this._motionController.cancel();
    super.reset();
  }

  pause(): void {
    this._motionController.pause();
    this._updateControllerState('PAUSED');
  }

  destroy(): void {
    this._updateControllerState('DESTROYED');
  }

  finish(): void {
    this._motionController.complete();
    super.finish();
  }
}

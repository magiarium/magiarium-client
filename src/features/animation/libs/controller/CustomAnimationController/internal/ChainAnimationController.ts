import { AnimationControllerParams } from '../../type';
import { BaseCustomAnimationController } from '../BaseCustomAnimationController';

/**
 * SimpleAnimationControllerを順次実行するコントローラーのクラス
 */
export class ChainAnimationController extends BaseCustomAnimationController {
  private _currentIndex: number = 0;

  private isInitialize = false;

  reset() {
    super.reset();
    this._currentIndex = 0;
  }

  finish(): void {
    super.finish();
    this._currentIndex = this._childrenController.length - 1;
  }

  async start(): Promise<void> {
    this._updateControllerState('RUNNING');

    switch (this._playState.type) {
      case 'ONCE':
        if (!this.isInitialize) {
          this._onInitialize();
          this.isInitialize = true;
        }
        while (this._currentIndex < this._childrenController.length) {
          await this._childrenController[this._currentIndex].start();
          this._currentIndex++;
        }
        this._onComplete();
        break;
      case 'INFINITE':
        while (this._playState.type === 'INFINITE') {
          if (!this.isInitialize) {
            this._onInitialize();
            this.isInitialize = true;
          }
          while (this._currentIndex < this._childrenController.length) {
            await this._childrenController[this._currentIndex].start();
            this._currentIndex++;
          }
          this.reset();
        }
        break;
      case 'LOOP':
        while (this._playState.currentCount < this._playState.totalCount) {
          if (!this.isInitialize) {
            this._onInitialize();
            this.isInitialize = true;
          }
          while (this._currentIndex < this._childrenController.length) {
            await this._childrenController[this._currentIndex].start();
            this._currentIndex++;
          }
          this.reset();
          this._playState.currentCount++;
        }
        this._onComplete();
        break;
    }
  }

  pause() {
    this._childrenController[this._currentIndex].pause();
    this._updateControllerState('PAUSED');
  }

  getParams(): AnimationControllerParams {
    // 子コントローラーのパラメータを全取得
    const childControllersParam = this._childrenController.map((value) =>
      value.getParams()
    );
    // 上記をもとに、このコントローラーのパラメータを計算
    let resultProgress;
    if (this._playState.type === 'INFINITE') {
      // `INFINITE`の場合はInfinity固定
      resultProgress = Infinity;
    } else {
      // currentIndexから現在処理中のコントローラーを取得
      const currentIndex = this._currentIndex;
      const currentProgress =
        childControllersParam[currentIndex].playState.progress;
      // 合計コントローラー数をもとに、このコントローラーの正確なProgressを取得
      const totalControllers = this._childrenController.length;
      const preciseProgress =
        (currentIndex + currentProgress) / totalControllers;
      if (this._playState.type === 'ONCE') {
        // `ONCE`の場合はそのまま設定
        resultProgress = preciseProgress;
      } else {
        // `LOOP`の場合、合計ループ数に対するprogressを計算
        resultProgress =
          (this._playState.currentCount + preciseProgress) /
          this._playState.totalCount;
      }
      // resultProgressが`Infinity`以外（子コントローラーに`INFINITE`がない）場合、閾値オーバーを丸め込む
      if (resultProgress !== Infinity) {
        resultProgress = resultProgress > 1 ? 1 : resultProgress;
      }
    }
    this._playState = {
      ...this._playState,
      progress: resultProgress,
    };

    return {
      controllerId: this._controllerId,
      controllerState: this._controllerState,
      playState: this._playState,
      usedSelector: this._usedSelectors,
      children: childControllersParam,
    };
  }
}

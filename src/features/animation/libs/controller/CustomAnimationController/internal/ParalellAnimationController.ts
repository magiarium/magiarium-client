import { AnimationControllerParams } from '../../type';
import { BaseCustomAnimationController } from '../BaseCustomAnimationController';

export class ParalellAnimationController extends BaseCustomAnimationController {
  async start(): Promise<void> {
    this._updateControllerState('RUNNING');

    switch (this._playState.type) {
      case 'ONCE':
        this._onInitialize();
        await Promise.all(
          this._childrenController.map(async (targetController) => {
            await targetController.start();
          })
        );
        this._onComplete();
        break;
      case 'INFINITE':
        while (this._playState.type === 'INFINITE') {
          this._onInitialize();
          await Promise.all(
            this._childrenController.map(async (targetController) => {
              await targetController.start();
              targetController.destroy(); // ゴミが残るのでループ毎にリソース破棄
            })
          );
          this.reset();
        }
        break;
      case 'LOOP':
        while (this._playState.currentCount < this._playState.totalCount) {
          this._onInitialize();
          await Promise.all(
            this._childrenController.map(async (targetController) => {
              await targetController.start();
              targetController.destroy(); // ゴミが残るのでループ毎にリソース破棄
            })
          );
          this.reset();
          this._playState.currentCount++;
        }
        this._onComplete();
        break;
    }
  }

  pause(): void {
    for (const targetChild of this._childrenController) {
      targetChild.pause();
    }
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
      // 子コントローラーの全Progressから平均値を計算
      const totalProgress = childControllersParam.reduce(
        (sum, params) => sum + params.playState.progress,
        0
      );
      const avgProgress = totalProgress / this._childrenController.length;
      if (this._playState.type === 'ONCE') {
        // `ONCE`の場合は平均値をそのまま設定
        resultProgress = avgProgress;
      } else {
        // `LOOP`の場合、合計ループ数に対するprogressを計算
        resultProgress =
          (this._playState.currentCount - 1 + avgProgress) /
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

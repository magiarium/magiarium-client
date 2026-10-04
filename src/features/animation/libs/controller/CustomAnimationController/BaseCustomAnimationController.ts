import { cyrb53 } from '@/common/libs/cybr53';
import { Selector } from '@/common/libs/getSelector';
import { AnimationController } from '../AnimationController';
import {
  AnimationControllerId,
  AnimationControllerParams,
  AnimationControllerState,
  PlayConfig,
  PlayState,
} from '../type';

export abstract class BaseCustomAnimationController implements AnimationController {
  /**
   * アニメーションコントローラーID
   */
  protected readonly _controllerId: AnimationControllerId;

  /**
   * セレクタ
   */
  protected readonly _usedSelectors: Selector[];

  /**
   * 子コントローラー
   */
  protected readonly _childrenController: AnimationController[];

  /**
   * アニメーション完了アクション
   */
  protected readonly _onComplete: () => void;

  /**
   * 初期化アクション
   */
  protected readonly _onInitialize: () => void;

  /**
   * 再生設定
   */
  protected _playState: PlayState;

  /**
   * アニメーションコントローラーのState
   */
  protected _controllerState: AnimationControllerState;

  constructor({
    children,
    playConfig,
    completeAction = () => {},
    initializeAction = () => {},
  }: {
    children: AnimationController[];
    playConfig: PlayConfig;
    completeAction?: () => void;
    initializeAction?: () => void;
  }) {
    this._usedSelectors = children
      .map((targetValue) => targetValue.getParams().usedSelector)
      .flat();

    this._controllerId = cyrb53(
      this._usedSelectors.join('-')
    ).toString() as AnimationControllerId;

    this._controllerState = 'PENDING';

    this._childrenController = children;

    switch (playConfig.type) {
      case 'ONCE':
        this._playState = {
          type: 'ONCE',
          progress: 0,
        };
        break;
      case 'INFINITE':
        this._playState = {
          type: 'INFINITE',
          progress: Infinity,
        };
        break;
      case 'LOOP':
        this._playState = {
          type: 'LOOP',
          totalCount: playConfig.totalCount,
          progress: 0,
          currentCount: 0,
        };
        break;
    }

    this._onComplete = () => {
      completeAction();
      this._updateControllerState('FINISHED');
    };

    this._onInitialize = () => {
      initializeAction();
      for (const childController of this._childrenController) {
        childController.reset();
      }
    };
  }

  getId(): AnimationControllerId {
    return this._controllerId;
  }

  finish(): void {
    for (const targetChild of this._childrenController) {
      targetChild.finish();
    }
    this._onComplete();
  }

  reset(): void {
    for (const targetChild of this._childrenController) {
      targetChild.reset();
    }
    this._onInitialize();
    this._updateControllerState('PENDING');
  }

  destroy(): void {
    for (const targetChild of this._childrenController) {
      targetChild.destroy();
    }
    this._updateControllerState('DESTROYED');
  }

  abstract start(): Promise<void>;

  abstract pause(): void;

  abstract getParams(): AnimationControllerParams;

  /**
   * ControllerState更新処理
   *
   * @param nextState ControllerStateの更新値
   */
  protected _updateControllerState = (nextState: AnimationControllerState) => {
    this._controllerState = nextState;
  };
}

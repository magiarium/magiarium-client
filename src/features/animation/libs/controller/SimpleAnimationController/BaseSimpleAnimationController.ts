import { cyrb53 } from '@/common/libs/cybr53';
import { getSelector, Selector } from '@/common/libs/getSelector';
import { Animator, AnimatorType } from '../../animator/type';
import { AnimationController } from '../AnimationController';
import {
  AnimationControllerId,
  AnimationControllerParams,
  AnimationControllerState,
  PlayConfig,
  PlayState,
} from '../type';

/**
 * SimpleAnimationControllerクラスの基本定義
 *
 * アニメーターによる単一アニメーションを制御する
 */
export abstract class BaseSimpleAnimationController<
  U extends AnimatorType = AnimatorType,
> implements AnimationController {
  /**
   * アニメーションコントローラーID
   */
  protected readonly _controllerId: AnimationControllerId;

  /**
   * アニメーターID
   */
  protected readonly _animator: Animator<U>;

  /**
   * アニメーション注入対象のHTMLElement
   */
  protected readonly _element: HTMLElement;

  /**
   * セレクタ
   */
  protected readonly _selectors: Selector[];

  /**
   * アニメーション完了時アクション
   */
  protected readonly _onComplete: () => void;

  /**
   *初期化アクション
   */
  protected readonly _onInitialize: () => void;

  /**
   * コントローラーの状態
   */
  protected _controllerState: AnimationControllerState;

  /**
   * 再生状態
   */
  protected _playState: PlayState;

  constructor({
    id,
    element,
    animator,
    playConfig,
    completeAction = () => {},
    initializeAction = () => {},
  }: {
    id?: string;
    element: HTMLElement;
    animator: Animator<U>;
    playConfig: PlayConfig;
    completeAction?: () => void;
    initializeAction?: () => void;
  }) {
    const targetSelector = getSelector(element);

    if (id) {
      this._controllerId = id as AnimationControllerId;
    } else {
      this._controllerId = cyrb53(
        `${targetSelector}_${animator.id}`
      ).toString() as AnimationControllerId;
    }
    this._controllerState = 'PENDING';

    this._element = element;
    this._selectors = [targetSelector];
    this._animator = animator;

    this._onComplete = (): void => {
      if (this._playState.type === 'LOOP') {
        // playStateが`Loop`の場合はupdateProgressで対応できないため、`currentCount`も合わせて自前で更新
        this._playState.currentCount = this._playState.totalCount;
        this._playState.progress = 1;
      } else {
        this._updateProgress(1);
      }
      completeAction();
      this._updateControllerState('FINISHED');
    };

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

    this._onInitialize = initializeAction;
  }

  getId(): AnimationControllerId {
    return this._controllerId;
  }

  getParams(): AnimationControllerParams {
    return {
      controllerId: this._controllerId,
      controllerState: this._controllerState,
      usedSelector: this._selectors,
      playState: this._playState,
      animatorId: this._animator.id,
    };
  }

  getElements(): HTMLElement[] {
    return [this._element];
  }

  finish(): void {
    this._onComplete();
  }
  reset(): void {
    this._onInitialize();
    this._updateControllerState('PENDING');
  }

  abstract start(): Promise<void>;

  abstract pause(): void;

  abstract destroy(): void;

  /**
   * 進捗度更新処理
   *
   * @param nextProgress 進捗度の更新値
   */
  protected _updateProgress = (nextProgress: number) => {
    if (nextProgress < 0 || 1 < nextProgress) {
      throw new Error(
        `不正な値が指定されました。progressは0<progress<1の範囲で指定してください。progress=[${nextProgress}].`
      );
    }
    switch (this._playState.type) {
      case 'INFINITE':
        return;

      case 'LOOP':
        this._playState = {
          ...this._playState,
          progress:
            (this._playState.currentCount + nextProgress) /
            this._playState.totalCount,
          currentCount:
            this._playState.currentCount + (nextProgress === 1 ? 1 : 0),
        };
        break;
      case 'ONCE':
        this._playState = {
          ...this._playState,
          progress: nextProgress,
        };
        break;
    }
  };

  /**
   * ControllerState更新処理
   *
   * @param nextState ControllerStateの更新値
   */
  protected _updateControllerState = (nextState: AnimationControllerState) => {
    this._controllerState = nextState;
  };
}

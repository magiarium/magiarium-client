import { BaseStore } from '@/common/libs/BaseStore';
import { AnimationController } from '../controller/AnimationController';
import {
  AnimationControllerId,
  AnimationControllerState,
} from '../controller/type';

export class AnimationControllerManager extends BaseStore {
  private _animationControllerMap: Map<
    AnimationControllerId,
    AnimationController
  > = new Map();

  /**
   * アニメーションコントローラー取得処理
   *
   * @param animationControllerId アニメーションコントローラーID
   * @returns アニメーションコントローラー|undefined
   */
  getAnimationController = (
    animationControllerId: AnimationControllerId
  ): AnimationController | undefined => {
    return this._animationControllerMap.get(animationControllerId);
  };

  /**
   * アニメーションコントローラー登録
   *
   * @param animationController アニメーションコントローラー
   */
  registerAnimationController = (
    animationController: AnimationController
  ): void => {
    const animationControllerId = animationController.getId();
    if (this._animationControllerMap.has(animationControllerId)) {
      throw new Error(
        `登録済みコントローラーです。animationControllerId=[${animationControllerId}]`
      );
    }
    this._animationControllerMap.set(
      animationControllerId,
      animationController
    );
    this._notify();
  };

  /**
   * アニメーションコントローラー削除処理
   *
   * @param animationControllerId アニメーションコントローラーID
   */
  deleteAnimationController = (
    animationControllerId: AnimationControllerId
  ): void => {
    this._animationControllerMap.delete(animationControllerId);
    this._notify();
  };

  /**
   * アニメーションコントローラー破棄処理
   *
   * @param animationControllerId アニメーションコントローラーID
   */
  destroyAnimationController = (
    animationControllerId: AnimationControllerId
  ) => {
    this._animationControllerMap.get(animationControllerId)?.destroy();
    this._animationControllerMap.delete(animationControllerId);
    this._notify();
  };

  /**
   * アニメーション開始処理
   *
   * @param animationControllerId アニメーションコントローラーID
   */
  startAnimationController = (animationControllerId: AnimationControllerId) => {
    this._animationControllerMap.get(animationControllerId)?.start();
    this._notify();
  };

  /**
   * アニメーション修了処理
   *
   * @param animationControllerId アニメーションコントローラーID
   */
  finishAnimationController = (
    animationControllerId: AnimationControllerId
  ) => {
    this._animationControllerMap.get(animationControllerId)?.finish();
    this._notify();
  };

  /**
   * アニメーションコントローラーState取得処理
   *
   * @param animationControllerId アニメーションコントローラーID
   * @returns アニメーションコントローラーState
   */
  getAnimationControllerState = (
    animationControllerId: AnimationControllerId
  ): AnimationControllerState | undefined => {
    console.log(this._animationControllerMap);
    return this._animationControllerMap.get(animationControllerId)?.getParams()
      .controllerState;
  };
}

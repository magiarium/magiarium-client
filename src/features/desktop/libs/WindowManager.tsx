import { BaseStore } from '@/common/libs/BaseStore';
import { WindowConfig, WindowControllerId } from '../type';
import { WindowController } from './WindowController';

export class WindowControllerManager extends BaseStore {
  private _windowControllerMap: Map<WindowControllerId, WindowController> =
    new Map();

  private _windowOrder: WindowControllerId[] = [];

  /**
   * WindowControllerの作成 & Managerへの登録を実施する処理
   *
   * @param argsConfig Window設定
   * @returns WindowController
   */
  createWindowController = (argsConfig: WindowConfig): WindowController => {
    if (this.hasWindowController(argsConfig.id)) {
      throw new Error(
        `対象コントローラーは既に登録済みです。windowControllerId=[${argsConfig.id}]`
      );
    }
    const windowController = new WindowController({
      ...argsConfig,
      position: {
        x: 20 + this._windowOrder.length * 20,
        y: 20 + this._windowOrder.length * 20,
      },
      size: {
        width: 666,
        height: 400,
      },
      notify: () => this._notify(),
      deleteAction: () => this._deleteWindowController(argsConfig.id),
      toActiveAction: () => this._toActiveWindow(argsConfig.id),
      toDisactiveAction: () => this._toDisactiveWindow(argsConfig.id),
      getOrder: () => this._windowOrder.indexOf(argsConfig.id) + 1,
    });

    this._windowControllerMap.set(windowController.id, windowController);
    this._windowOrder.push(windowController.id);

    this._notify();

    return windowController;
  };

  /**
   * WindowController削除処理(WindowControllerのコールバック用)
   *
   * @param argsId WindowCOntrollerID
   */
  private _deleteWindowController = (argsId: WindowControllerId): void => {
    this._windowControllerMap.delete(argsId);
    this._windowOrder = this._windowOrder.filter(
      (windowId) => windowId !== argsId
    );
    this._notify();
  };

  /**
   * 対象Windowのアクティブ化処理(WindowControllerのコールバック用)
   *
   * @param argsId WindowControllerID
   */
  private _toActiveWindow = (argsId: WindowControllerId): void => {
    if (
      !this._windowControllerMap.has(argsId) ||
      argsId === this._windowOrder[this._windowOrder.length - 1]
    ) {
      return;
    }

    this._windowOrder = [
      ...this._windowOrder.filter((windowId) => windowId !== argsId),

      argsId,
    ];

    this._notify();
  };

  /**
   * 対象Windowの非アクティブ化処理(WindowControllerのコールバック用)
   *
   * @param argsId WindowControllerID
   */
  private _toDisactiveWindow = (argsId: WindowControllerId): void => {
    if (
      !this._windowControllerMap.has(argsId) ||
      argsId !== this._windowOrder[this._windowOrder.length - 1]
    ) {
      return;
    }

    this._windowOrder = [
      argsId,
      ...this._windowOrder.filter((windowId) => windowId !== argsId),
    ];

    this._notify();
  };

  /**
   * Manager登録済みの全WindowController取得処理
   *
   * @returns WindowController配列
   */
  getWindowControllerAll = (): WindowController[] => {
    return [...this._windowControllerMap.values()];
  };

  /**
   * Windowの重ね順を取得する処理 ※後勝ち（配列の最初が最背面、末尾が最前面）
   *
   * @returns WindowControllerID
   */
  getWindowOrder = (): WindowControllerId[] => {
    return this._windowOrder;
  };

  /**
   * 対象IDのWindowControllerが存在するかチェックする処理
   *
   * @param windowControllerId WindowControllerID
   * @returns true:存在する、false:存在しない
   */
  hasWindowController = (windowControllerId: WindowControllerId) => {
    return this._windowControllerMap.has(windowControllerId);
  };
}

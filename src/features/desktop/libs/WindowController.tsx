import { Coordinates, Size } from '@/common/type';
import { ReactNode } from 'react';
import { WindowConfig, WindowControllerId, WindowState } from '../type';

/**
 * ウィンドウごとの個別情報&処理を管理するためのクラス
 */
export class WindowController {
  readonly id: WindowControllerId;
  readonly title: string;
  readonly subTitle?: string;
  readonly children: ReactNode;
  readonly href?: string;

  private _windowState: WindowState = 'OPENED';

  private _notify: () => void;

  private _position: Coordinates;
  private _size: Size;

  /** 削除処理 ※．コンストラクタの引数として、Managerからコールバック関数を設定 */
  delete: () => void;

  /** アクティブ化処理 ※．コンストラクタの引数として、Managerからコールバック関数を設定 */
  onActive: () => void;

  /** 非アクティブ化処理 ※．コンストラクタの引数として、Managerからコールバック関数を設定 */
  onDisactive: () => void;

  /** 並び順取得処理 ※．コンストラクタの引数として、Managerからコールバック関数を設定 */
  getOrder: () => number;

  constructor({
    id,
    title,
    subTitle,
    children,
    href,
    position,
    size,
    notify,
    deleteAction,
    toActiveAction,
    toDisactiveAction,
    getOrder,
  }: WindowConfig & {
    position: Coordinates;
    size: Size;
    notify: () => void;
    deleteAction: () => void;
    toActiveAction: () => void;
    toDisactiveAction: () => void;
    getOrder: () => number;
  }) {
    this.id = id;
    this.title = title;
    this.subTitle = subTitle;
    this.children = children;
    this.href = href;
    this._position = position;
    this._size = size;
    this._notify = notify;
    this.delete = deleteAction;
    this.onActive = toActiveAction;
    this.onDisactive = toDisactiveAction;
    this.getOrder = getOrder;
  }

  /**
   * Windowの開閉状態を取得する処理
   *
   * @returns 'CLOSED' | 'OPENED'
   */
  getWindowState = (): WindowState => {
    return this._windowState;
  };

  /**
   * Windowの開閉状態を更新する処理
   *
   * @param nextState 開閉状態
   */
  setWindowState = (nextState: WindowState) => {
    this._windowState = nextState;
    this._notify();
  };

  /**
   * ウィンドウ座標取得処理
   *
   * @returns ウィンドウ座標(x座標、y座標)
   */
  getPosition = () => {
    return this._position;
  };

  /**
   * ウィンドウ座標更新処理
   *
   * @param nextPosition.x X座標
   * @param nextPosition.y Y座標
   */
  setPosition = (nextPosition: Coordinates) => {
    this._position = nextPosition;
    this._notify();
  };

  /**
   * ウィンドウサイズ取得処理
   *]
   * @returns ウィンドウサイズ(width, height)
   */
  getSize = () => {
    return this._size;
  };

  /**
   * ウィンドウサイズ行員処理
   *
   * @param nextSize.width 横幅
   * @oaram nextSize.height 高さ
   */
  setSize = (nextSize: Size) => {
    this._size = nextSize;
    this._notify();
  };
}

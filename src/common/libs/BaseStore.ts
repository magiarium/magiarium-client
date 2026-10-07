/**
 * ストア用の基底クラス
 */
export abstract class BaseStore {
  private _version: number = 0;
  private _listeners = new Set<() => void>();
  /**
   * ストアの変更を購読する処理
   *
   * @param listener ストア変更時に呼び出すリスナー
   * @returns 購読を解除する関数
   */
  subscribe = (listener: () => void) => {
    this._listeners.add(listener);

    return () => {
      this._listeners.delete(listener);
    };
  };

  /**
   * ストアの現在のバージョンを取得する。
   *
   * @returns ストアのバージョン番号
   */
  getSnapshot = (): number => {
    return this._version;
  };

  /**
   * サーバー環境におけるストアのスナップショットを取得する。
   *
   * `useSyncExternalStore` のサーバー側スナップショット取得関数として使用する。
   *
   * @returns ストアのバージョン番号
   */
  getServerSnapShot = (): number => {
    return this._version;
  };

  /**
   * ストアの変更を通知する。
   *
   * バージョンを更新し、購読中のすべてのリスナーを呼び出す。
   */
  _notify = () => {
    this._version++;
    for (const listener of this._listeners) {
      listener();
    }
  };
}

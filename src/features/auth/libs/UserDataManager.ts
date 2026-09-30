import { signOut } from 'aws-amplify/auth';
import { GUEST_ACCOUNT } from '../constants';
import type { AccountInfo, AccountRole } from '../type';
import { registerUserDataToCookies } from './registerUserDataToCookies';

/**
 * ユーザー固有情報マネージャー
 */
export class UserDataManager {
  private _currentAccount: AccountInfo;

  private _availableAccounts: AccountInfo[];

  private _version: number = 0;
  private _listeners = new Set<() => void>();

  constructor({
    currentAccount = GUEST_ACCOUNT,
    availableAccounts = [GUEST_ACCOUNT],
  }: {
    currentAccount?: AccountInfo;
    availableAccounts?: AccountInfo[];
  }) {
    this._currentAccount = currentAccount;
    this._availableAccounts = availableAccounts;
  }

  /**
   * カレントアカウントを変更する
   *
   * @param targetAccount 対象アカウント情報
   */
  changeCurrentAccount = async (targetAccount: AccountInfo): Promise<void> => {
    this._currentAccount = targetAccount;

    if (targetAccount.role === 'GUEST') {
      // ゲストアカウントを利用する場合、認証アカウントはサインアウト
      await signOut();
    } else {
      // ゲストアカウント以外の場合、新規アカウントであれば利用可能アカウント一覧に追加
      this._availableAccounts
        .filter((value) => value.id !== targetAccount.id)
        .push(targetAccount);
    }
    // Cookie側も同様に更新
    registerUserDataToCookies(targetAccount);
    // 更新
    this._notify();
  };

  /**
   * カレントアカウント取得処理
   *
   * @returns カレントアカウント
   */
  getCurrentAccount = () => {
    return this._currentAccount;
  };

  /**
   * カレント権限ロール取得処理
   * @returns カレント権限ロール
   */
  getCurrentRole = (): AccountRole => {
    return this._currentAccount.role;
  };

  /**
   * 利用可能アカウント一覧取得処理
   *
   * @returns 利用可能アカウント一覧
   */
  getAvailableAccounts = (): AccountInfo[] => {
    return this._availableAccounts;
  };

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

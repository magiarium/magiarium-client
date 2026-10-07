import { BaseStore } from '@/common/libs/BaseStore';
import { signOut } from 'aws-amplify/auth';
import { GUEST_ACCOUNT } from '../constants';
import type { AccountInfo, AccountRole } from '../type';
import { registerUserDataToCookies } from './registerUserDataToCookies';

/**
 * ユーザー固有情報マネージャー
 */
export class UserDataManager extends BaseStore {
  private _currentAccount: AccountInfo;

  private _availableAccounts: AccountInfo[];

  constructor({
    currentAccount = GUEST_ACCOUNT,
    availableAccounts = [GUEST_ACCOUNT],
  }: {
    currentAccount?: AccountInfo;
    availableAccounts?: AccountInfo[];
  }) {
    super();
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
}

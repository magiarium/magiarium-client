import { signOut } from 'aws-amplify/auth';
import { GUEST_USER_ACCOUNT, UserAccountInfo, UserAccountRole } from '../type';
import { registerUserDataToCookies } from './registerUserDataToCookies';

/**
 * ユーザー固有情報マネージャー
 */
export class UserDataManager {
  private _currentUserAccount: UserAccountInfo;

  private _availableUserAccounts: UserAccountInfo[];

  private _version: number = 0;
  private _listeners = new Set<() => void>();

  constructor({
    currentUserAccount = GUEST_USER_ACCOUNT,
    availableUserAccounts = [GUEST_USER_ACCOUNT],
  }: {
    currentUserAccount?: UserAccountInfo;
    availableUserAccounts?: UserAccountInfo[];
  }) {
    this._currentUserAccount = currentUserAccount;
    this._availableUserAccounts = availableUserAccounts;
  }

  /**
   * サインイン処理
   * ※実際のサインインはAmplifyとの兼ね合いがあるためHandler側に定義
   * @param signinUserAccount ユーザーアカウント情報
   */
  signin = async (signinUserAccount: UserAccountInfo): Promise<void> => {
    this._currentUserAccount = signinUserAccount;

    if (signinUserAccount.role === 'GUEST') {
      // ゲストユーザーを利用する場合、認証アカウントはサインアウト
      await signOut();
    } else {
      // ゲストユーザー以外の場合、新規アカウントであれば利用可能アカウント一覧に追加
      this._availableUserAccounts
        .filter((target) => target.id !== signinUserAccount.id)
        .push(signinUserAccount);
    }
    // Cookie側も同様に更新
    registerUserDataToCookies(signinUserAccount);
    // 更新
    this._notify();
  };

  getCurrentAccount = () => {
    return this._currentUserAccount;
  };

  getRole = (): UserAccountRole => {
    return this._currentUserAccount.role;
  };

  getAvailableAccounts = (): UserAccountInfo[] => {
    return this._availableUserAccounts;
  };

  subscribe = (listener: () => void) => {
    this._listeners.add(listener);

    return () => {
      this._listeners.delete(listener);
    };
  };

  getSnapshot = (): number => {
    return this._version;
  };

  getServerSnapShot = (): number => {
    return this._version;
  };

  _notify = () => {
    this._version++;
    for (const listener of this._listeners) {
      listener();
    }
  };
}

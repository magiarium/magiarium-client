import { BaseStore } from '@/common/libs/BaseStore';
import { AppState, NoticeConfig } from '../type';

export class Application extends BaseStore {
  private _appState: AppState = 'INITIAL';
  private _notice: NoticeConfig | null = null;

  /**
   * AppState更新処理
   *
   * @param appState AppState
   */
  setAppState = (appState: AppState) => {
    this._appState = appState;
    this._notify();
  };

  /**
   * AppState取得処理
   *
   * @returns AppState
   */
  getAppState = () => {
    return this._appState;
  };

  setNotice = (nextNotice: NoticeConfig) => {
    this._notice = nextNotice;
    this._notify();
  };

  closeNotice = () => {
    if (this._notice === null) {
      return;
    }
    this._notice.onClose?.();
    this._notice = null;
    this._notify();
  };

  getNotice = (): NoticeConfig | null => {
    return this._notice;
  };
}

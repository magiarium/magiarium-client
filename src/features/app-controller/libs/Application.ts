import { BaseStore } from '@/common/libs/BaseStore';
import { AppState } from '../type';

export class Application extends BaseStore {
  private _appState: AppState = 'INITIAL';

  /**
   * AppState更新処理
   * @param appState AppState
   */
  setAppState = (appState: AppState) => {
    this._appState = appState;
    this._notify();
  };

  /**
   *AppState取得処理

   * @returns AppState
   */
  getAppState = () => {
    return this._appState;
  };
}

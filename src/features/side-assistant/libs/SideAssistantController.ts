import { BaseStore } from '@/common/libs/BaseStore';
import { ReactNode } from 'react';

export class SideAssistantController extends BaseStore {
  private _speechContent: ReactNode;
  constructor({ speechContext }: { speechContext: ReactNode }) {
    super();
    this._speechContent = speechContext;
  }

  /**
   * 台詞更新処理
   * @param speech 台詞
   */
  setSpeechContent = (speechContent: ReactNode) => {
    this._speechContent = speechContent;
    this._notify();
  };

  /**
   * サイドアシスタント取得処理
   *
   * @returns サイドアシスタント
   */
  getSideAssistant = () => {
    return {
      speechContent: this._speechContent,
    };
  };
}

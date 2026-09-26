'use client';

import Script from 'next/script';

import { ADOBE_PROJECT_ID } from '@/constants';

/**
 * グローバルなWindowインターフェースを拡張する。
 */
declare global {
  interface Window {
    /**
     * Adobe Fonts（Typekit）が提供するグローバルオブジェクト。
     */
    Typekit: {
      /**
       * Adobe Fontsのフォントを読み込む。
       *
       * @param options フォント読み込み時のオプション
       * @param options.kitId Adobe FontsのKit ID
       * @param options.async 非同期でフォントを読み込むかどうか
       */
      load: (options?: { kitId?: string; async?: boolean }) => void;
    };
  }
}

/**
 * AdobeFontsのWebフォントを読み込むためのコンポーネント。
 *
 * Typekitのプロジェクトスクリプトを読み込み、
 * スクリプトのロード完了後にTypekitのフォントを非同期でロードする。
 *
 * @returns AdobeFontsを読み込むためのScriptコンポーネント
 */
export const AdobeFontsLoader = () => {
  return (
    <Script
      src={`https://use.typekit.net/${ADOBE_PROJECT_ID}.js`}
      strategy="afterInteractive"
      onLoad={() => {
        window.Typekit?.load({ async: true });
      }}
    />
  );
};

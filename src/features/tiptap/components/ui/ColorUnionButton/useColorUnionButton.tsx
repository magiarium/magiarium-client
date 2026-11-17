import {
  HighlightMode,
  pickHighlightColorsByValue,
} from '@/features/tiptap/components/ui/ColorHighlightButton';
import { Editor } from '@tiptap/react';
import { pickFontColorByValue } from '../FontColorButton';

/**
 * ユニオンカラー機能の設定
 */
export interface UseColorUnionConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * フォントカラー設定
   */
  font: {
    /**
     * フォントカラー
     */
    color?: string;
    /**
     * フォントカラーラベル
     */
    label?: string;
    /**
     * フォントカラー設定時のコールバック関数
     */
    onApplied?: ({ color, label }: { color: string; label: string }) => void;
  };

  /**
   * カラーハイライト設定
   */
  highlight: {
    /**
     * ハイライトカラー
     */
    color?: string;
    /**
     * ハイライトカラーラベル
     */
    label?: string;
    /**
     * カラーハイライト設定時のコールバック関数
     */
    onApplied?: ({
      color,
      label,
      mode,
    }: {
      color: string;
      label: string;
      mode: HighlightMode;
    }) => void;
  };

  /**
   * 見出しが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * true の場合、CSS変数（value）ではなく、実際の色の値（colorValue）を使用する。
   * @default false
   */
  useColorValue?: boolean;
}

/**
 * カラー定義型定義
 */
export type ColorUnion = {
  /** ラベル */
  label: string;
  /** フォントカラー */
  fontColor: string;
  /** ハイライトカラー */
  highlightColor: string;
};

/**
 * 指定された色の値に対応するカラーユニオンを取得する。
 *
 * @param values - 取得対象のカラーユニオンの値一覧
 * @returns 指定された値に一致するカラーユニオンの一覧
 */
export const pickColorUnionByValue = (values: ColorUnion[]): ColorUnion[] => {
  return values.filter(
    (color): color is ColorUnion =>
      pickFontColorByValue([color.fontColor]).length !== 0 &&
      pickHighlightColorsByValue([color.highlightColor]).length !== 0
  );
};

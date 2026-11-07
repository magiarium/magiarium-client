'use client';
import { type Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import {
  isMarkInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';

// --- Icons ---
import { BsPalette } from 'react-icons/bs';

/** フォントカラー一覧 */
export const FONT_COLORS = [
  {
    label: 'Gray',
    value: 'var(--tt-color-text-gray)',
    colorValue: '#616161',
    border: 'var(--tt-color-text-gray-contrast)',
  },
  {
    label: 'Brown',
    value: 'var(--tt-color-text-brown)',
    colorValue: '#795548',
    border: 'var(--tt-color-text-brown-contrast)',
  },
  {
    label: 'Orange',
    value: 'var(--tt-color-text-orange)',
    colorValue: '#e67e22',
    border: 'var(--tt-color-text-orange-contrast)',
  },
  {
    label: 'Yellow',
    value: 'var(--tt-color-text-yellow)',
    colorValue: '#d4a017',
    border: 'var(--tt-color-text-yellow-contrast)',
  },
  {
    label: 'Green',
    value: 'var(--tt-color-text-green)',
    colorValue: '#2E7d32',
    border: 'var(--tt-color-text-green-contrast)',
  },
  {
    label: 'Blue',
    value: 'var(--tt-color-text-blue)',
    colorValue: '#1976d2',
    border: 'var(--tt-color-text-blue-contrast)',
  },
  {
    label: 'Purple',
    value: 'var(--tt-color-text-purple)',
    colorValue: '#7b1fa2',
    border: 'var(--tt-color-text-purple-contrast)',
  },
  {
    label: 'Pink',
    value: 'var(--tt-color-text-pink)',
    colorValue: '#d45087',
    border: 'var(--tt-color-text-pink-contrast)',
  },
  {
    label: 'Red',
    value: 'var(--tt-color-text-red)',
    colorValue: '#d32f2f',
    border: 'var(--tt-color-text-red-contrast)',
  },
];

/** フォントカラー型定義 */
export type FontColor = (typeof FONT_COLORS)[number];

/**
 * フォントカラー機能の設定
 */
export interface UseFontColorConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * フォントカラー切り替え時に適用する色。
   */
  fontColor?: string;

  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  label?: string;

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

  /**
   * フォントカラー適用が正常に完了した後に呼び出されるコールバック関数
   */
  onApplied?: ({ color, label }: { color: string; label: string }) => void;
}

/**
 * 指定された色の値に対応するフォントカラーを取得する。
 *
 *
 * FONT_COLORS を基に色の値（value）とカラーオブジェクトの
 * マッピングを作成し、指定された値に一致するカラーオブジェクトを返す。
 * 一致するカラーが存在しない場合は除外する。
 *
 * @param values - 取得対象のフォントカラーの値一覧
 * @returns 指定された値に一致するフォントカラーの一覧
 */
export const pickFontColorByValue = (values: string[]) => {
  const colorMap = new Map(FONT_COLORS.map((color) => [color.value, color]));

  return values
    .map((value) => colorMap.get(value))
    .filter((color): color is (typeof FONT_COLORS)[number] => !!color);
};

/**
 * 現在のエディター状態で、フォントカラー切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns true:利用可、false:利用不可
 */
export const canFontColor = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isMarkInSchema('textStyle', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().setColor('test');
};

/**
 * 設定に応じて適切な払いとカラーの値を取得する
 *
 * @param color フォントカラーの値
 * @param useColorValue 実際の色の値を使用するか否か
 * @return 設定に応じたフォントカラーの値
 */
export const getFontColorValue = (
  color: string,
  useColorValue: boolean
): string => {
  if (!useColorValue) return color;

  const colorItem = FONT_COLORS.find(
    (c) => c.value === color || c.colorValue === color
  );

  return colorItem?.colorValue || color;
};
/**
 * 対象のフォントカラーが現在アクティブ状態かどうかチェックする
 *
 * @param editor Tiptapエディターインスタンス
 * @param fontColor フォントカラー
 * @returns true:アクティブ状態、false:非アクティブ状態
 */
export const isFontColorActive = (
  editor: Editor | null,
  fontColor?: string
): boolean => {
  if (!editor || !editor.isEditable) return false;

  const { color } = editor.getAttributes('textStyle');

  return fontColor ? color === fontColor : !!color;
};

/**
 * ボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable 対象機能が使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export const shouldShowButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isMarkInSchema('textStyle', editor)) return false;

  if (!editor.isActive('code')) {
    return canFontColor(editor);
  }

  return true;
};

/**
 * フォントカラーを設定する処理
 *
 * @param editor Tiptapエディター
 * @param fontColor フォントカラー
 * @returns ture:成功、false:失敗
 */
export const setFontColor = (
  editor: Editor | null,
  fontColor: string
): boolean => {
  if (!editor || editor.isDestroyed || !editor.isEditable) return false;
  if (!canFontColor(editor)) return false;

  return editor.chain().focus().setColor(fontColor).run();
};

/**
 * フォントカラーを取り除く処理
 *
 * @param editor Tiptapエディター
 * @returns true:成功、false:失敗
 */
export const removeFontColor = (editor: Editor | null) => {
  if (!editor || !editor.isEditable) return false;
  if (!canFontColor(editor)) return false;

  return editor.chain().focus().unsetColor().run();
};

/**
 * Tiptapエディター向けのフォントカラー機能を提供するカスタムフック
 *
 * @param config フォントカラー設定
 */
export const useFontColor = (config: UseFontColorConfig) => {
  const {
    editor: providedEditor,
    label,
    fontColor,
    hideWhenUnavailable = false,
    useColorValue = false,
    onApplied,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canFontColorState = canFontColor(editor);
  const actualColor = fontColor
    ? getFontColorValue(fontColor, useColorValue)
    : fontColor;
  const isActive = isFontColorActive(editor, actualColor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleFontColor = useCallback(() => {
    if (!actualColor || !label) {
      return false;
    }
    const succsess = setFontColor(editor, actualColor);
    if (succsess) {
      onApplied?.({ color: actualColor, label });
    }
    return succsess;
  }, [canFontColorState, actualColor, editor, label, onApplied]);

  const handleRemoveFontColor = useCallback(() => {
    const success = removeFontColor(editor);
    if (success) {
      onApplied?.({ color: '', label: 'Remove FontColor' });
    }
    return success;
  }, [editor, onApplied]);

  return {
    isVisible,
    isActive,
    handleFontColor,
    handleRemoveFontColor,
    canFontColor: canFontColorState,
    label: label,
    Icon: BsPalette,
  };
};

'use client';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import { isExtensionAvailable } from '@/features/tiptap/lib/tiptapUtils';

// --- Icons ---
import { FiType } from 'react-icons/fi';

/**
 * フォントサイズ機能の設定
 */
export interface UseFontSizeConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * 見出しレベル
   */
  fontSize?: string;

  /**
   * 見出しが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  label?: string;

  /**
   * 見出しの切り替えが正常に完了した後に呼び出されるコールバック関数
   */
  onApplied?: ({
    fontSize,
    label,
  }: {
    fontSize: string;
    label: string;
  }) => void;
}

/**
 * フォントサイズ一覧
 */
export const FONT_SIZES = [
  {
    label: '標準サイズ',
    value: '1rem',
  },
  { label: '大サイズ', value: '1.25rem' },
  {
    label: '小サイズ',
    value: '0.75rem',
  },
];

/**
 * フォントサイズ型定義
 */
export type FontSize = (typeof FONT_SIZES)[number];

/**
 * 現在のエディター状態で、フォントサイズの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns true:利用可、false:利用不可
 */
export const canFontSize = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (!isExtensionAvailable(editor, ['textStyle'])) return false;

  try {
    return editor.can().setFontSize('1rem');
  } catch {
    return false;
  }
};

/**
 * 対象のフォントサイズが現在アクティブ状態かチェックする処理
 *
 * @param editor Tiptapエディターインスタンス
 * @param fontSize フォントサイズ
 * @returns true:アクティブ状態、false:非アクティブ状態
 */
export const isFontSizeActive = (
  editor: Editor | null,
  fontSize?: string
): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (!fontSize) return false;

  try {
    return editor.getAttributes('textStyle').fontSize === fontSize;
  } catch {
    return false;
  }
};
/**
 * フォントサイズボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable フォントサイズ機能が使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export const shouldShowButton = (
  editor: Editor | null,
  hideWhenUnavailable: boolean
): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isActive('code')) {
    return canFontSize(editor);
  }
  return true;
};

/**
 * フォントサイズを設定する処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param fontSize フォントサイズ
 * @returns true:成功、false:失敗
 */
export const setFontSize = (
  editor: Editor | null,
  fontSize?: string
): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!fontSize) return false;
  if (!canFontSize(editor)) return false;

  return editor.chain().focus().setFontSize(fontSize).run();
};

/**
 * フォントサイズを除去する処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns true:成功、false:失敗
 */
export const removeFontSize = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canFontSize(editor)) return false;

  return editor.chain().focus().unsetFontSize().run();
};

/**
 * Tiptapエディター向けのフォントサイズ機能を提供するカスタムフック。
 *
 * @param config フォントサイズ機能の設定
 */
export const useFontSize = (config: UseFontSizeConfig) => {
  const {
    editor: providedEditor,
    fontSize,
    hideWhenUnavailable = false,
    label,
    onApplied,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canFontSizeState = canFontSize(editor);
  const isActive = isFontSizeActive(editor, fontSize);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton(editor, hideWhenUnavailable));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleFontSize = useCallback(() => {
    if (!editor || !canFontSizeState || !fontSize || !label) {
      return false;
    }

    const success = setFontSize(editor, fontSize);
    if (success) {
      onApplied?.({ fontSize, label });
    }
    return success;
  }, [editor, canFontSizeState, label, fontSize, onApplied]);

  const handleRemoveFontSize = useCallback(() => {
    const success = removeFontSize(editor);
    if (success) {
      onApplied?.({ fontSize: '', label: 'Remove fontsize' });
    }
    return success;
  }, [editor, onApplied]);

  return {
    isVisible,
    isActive,
    handleFontSize,
    handleRemoveFontSize,
    canFontSize: canFontSizeState,
    label: label || `FontSize`,
    Icon: FiType,
  };
};

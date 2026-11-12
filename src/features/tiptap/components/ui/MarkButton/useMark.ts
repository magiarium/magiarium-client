'use client';

import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import {
  isMarkInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';

// --- Icons ---
import {
  BsCodeSlash,
  BsSubscript,
  BsSuperscript,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from 'react-icons/bs';

/** マーク種別 */
export type Mark =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'code'
  | 'underline'
  | 'superscript'
  | 'subscript';

/**
 * マーク機能の設定
 */
export interface UseMarkConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * マーク種別
   */
  type: Mark;

  /**
   * 引用ブロックが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * マークの切り替えが正常に完了した後に呼び出されるコールバック関数
   */
  onToggled?: () => void;
}

/** マークアイコン一覧 */
export const markIcons = {
  bold: BsTypeBold,
  italic: BsTypeItalic,
  underline: BsTypeUnderline,
  strike: BsTypeStrikethrough,
  code: BsCodeSlash,
  superscript: BsSuperscript,
  subscript: BsSubscript,
};

/** マークショートカットキー一覧 */
export const MARK_SHORTCUT_KEYS: Record<Mark, string> = {
  bold: 'mod+b',
  italic: 'mod+i',
  underline: 'mod+u',
  strike: 'mod+shift+s',
  code: 'mod+e',
  superscript: 'mod+.',
  subscript: 'mod+,',
};

/**
 * 現在のエディター状態で、マークの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type マーク種別
 */
export const canToggleMark = (editor: Editor | null, type: Mark): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!isMarkInSchema(type, editor) || isNodeTypeSelected(editor, ['image']))
    return false;

  return editor.can().toggleMark(type);
};

/**
 * Checks if a mark is currently active
 */
/**
 * マークが現在有効かチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type マーク種別
 * @returns true:有効、false:無効
 */
export const isMarkActive = (editor: Editor | null, type: Mark): boolean => {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive(type);
};

/**
 * エディター内のマークのオン・オフを切り替える処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type マーク種別
 * @return true:切り替え成功, false:切り替え失敗
 */
export const toggleMark = (editor: Editor | null, type: Mark): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleMark(editor, type)) return false;

  return editor.chain().focus().toggleMark(type).run();
};
/**
 * キーボードボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.type マーク種別
 * @param props.hideWhenUnavailable キーボードボタンが使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export const shouldShowButton = (props: {
  editor: Editor | null;
  type: Mark;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, type, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isMarkInSchema(type, editor)) return false;

  if (!editor.isActive('code')) {
    return canToggleMark(editor, type);
  }

  return true;
};

/**
 * フォーマットされたマーク名を取得する処理
 *
 * @param type マーク種別
 * @returns マーク種別
 */
export const getFormattedMarkName = (type: Mark): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Tiptapエディター向けのマーク機能を提供するカスタムフック。
 * @param config マーク機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MySimpleBoldButton() {
 *   const { isVisible, handleMark } = useMark({ type: "bold" })
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleMark}>Bold</button>
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedItalicButton() {
 *   const { isVisible, handleMark, label, isActive } = useMark({
 *     editor: myEditor,
 *     type: "italic",
 *     hideWhenUnavailable: true,
 *     onToggled: () => console.log('マークを切り替えました。')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleMark}
 *       aria-pressed={isActive}
 *       aria-label={label}
 *     >
 *       Italic
 *     </MyButton>
 *   )
 * }
 * ```
 */
export const useMark = (config: UseMarkConfig) => {
  const {
    editor: providedEditor,
    type,
    hideWhenUnavailable = false,
    onToggled,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canToggle = canToggleMark(editor, type);
  const isActive = isMarkActive(editor, type);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, type, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, type, hideWhenUnavailable]);

  const handleMark = useCallback(() => {
    if (!editor) return false;

    const success = toggleMark(editor, type);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, type, onToggled]);

  return {
    isVisible,
    isActive,
    handleMark,
    canToggle,
    label: getFormattedMarkName(type),
    shortcutKeys: MARK_SHORTCUT_KEYS[type],
    Icon: markIcons[type],
  };
};

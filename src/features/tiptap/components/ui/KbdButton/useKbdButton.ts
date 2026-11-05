'use client';

import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { BsKeyboard } from 'react-icons/bs';

// --- UI Utils ---
import {
  isMarkInSchema,
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';

// キーボード切り替え用ショートカットキー
export const KBD_SHORTCUT_KEY = 'mod+shift+k';

/**
 * キーボード機能の設定
 */
export interface UseKbdConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * 引用ブロックが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * キーボードの切り替えが正常に完了した後に呼び出されるコールバック関数
   */
  onToggled?: () => void;
}

/**
 * 現在のエディター状態で、キーボードの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 */
export const canToggleKbd = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (!isMarkInSchema('kbd', editor) || isNodeTypeSelected(editor, ['image'])) {
    return false;
  }

  return editor.can().toggleKbd();
};

/**
 * キーボードボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable キーボードボタンが使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export const shouldShowKbdButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isNodeInSchema('kbd', editor)) return false;

  if (!editor.isActive('code')) {
    return canToggleKbd(editor);
  }

  return true;
};

/**
 * エディター内のキーボードのオン・オフを切り替える処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @return true:切り替え成功, false:切り替え失敗
 */
export const toggleKbd = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleKbd(editor)) return false;

  return editor.chain().focus().toggleKbd().run();
};

/**
 * Tiptapエディター向けのキーボード機能を提供するカスタムフック。
 * @param config キーボード機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MySimpleKbdButton() {
 *   const { isVisible, handleToggle, isActive } = useKbdButton()
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleToggle}>Kbd</button>
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedKbdButton() {
 *   const { isVisible, handleToggle, label, isActive } = useKbdButton({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onToggled: () => console.log('キーボードの切り替え')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleToggle}
 *       aria-label={label}
 *       aria-pressed={isActive}
 *     >
 *       キーボードに切り替える
 *     </MyButton>
 *   )
 * }
 * ```
 */
export const useKbdButton = (config?: UseKbdConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState(true);
  const canToggle = canToggleKbd(editor);
  const isActive = editor?.isActive('kbd') ?? false;

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowKbdButton({
          editor,
          hideWhenUnavailable,
        })
      );
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleKbd = useCallback(() => {
    if (!editor) return false;

    const success = toggleKbd(editor);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, onToggled]);

  return {
    isVisible,
    isActive,
    handleKbd,
    canToggle,
    label: 'kbd',
    shortcutKeys: KBD_SHORTCUT_KEY,
    Icon: BsKeyboard,
  };
};

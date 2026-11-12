'use client';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import {
  isMarkInSchema,
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';

// --- Icons ---
import { BsQuote } from 'react-icons/bs';

// インライン引用切り替え用のショートカットキー
export const INLINE_QUOTE_SHORTCUT_KEY = 'mod+shift+q';

/**
 * インライン引用機能の設定
 */
export interface UseInlineQuoteConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * インライン引用機能が使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * インライン引用の切り替えが正常に完了した後に呼び出されるコールバック関数
   */
  onToggled?: () => void;
}

/**
 * 現在のエディター状態で、インライン引用の切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param turnInfo インライン引用への変換時に追加の判定を行うかどうか
 */
export const canToggleInlineQuote = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (
    !isMarkInSchema('inlineQuote', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().toggleInlineQuote();
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

  if (!isNodeInSchema('inlineQuote', editor)) return false;

  if (!editor.isActive('code')) {
    return canToggleInlineQuote(editor);
  }

  return true;
};
/**
 * エディター内のインライン引用のオン・オフを切り替える処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @return true:切り替え成功, false:切り替え失敗
 */
export const toggleInlineQuote = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleInlineQuote(editor)) return false;

  return editor.chain().focus().toggleInlineQuote().run();
};

/**
 * Tiptapエディター向けのインライン引用機能を提供するカスタムフック。
 *
 * @param config インライン引用機能の設定
 */
export const useInlineQuote = (config: UseInlineQuoteConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canToggle = canToggleInlineQuote(editor);
  const isActive = editor?.isActive('inlineQuote') || false;

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

  const handleInlineQuote = useCallback(() => {
    if (!editor) return false;

    const success = toggleInlineQuote(editor);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, onToggled]);

  return {
    isVisible,
    isActive,
    handleInlineQuote,
    canToggle,
    label: 'InlineQuote',
    shortcutKeys: INLINE_QUOTE_SHORTCUT_KEY,
    Icon: BsQuote,
  };
};

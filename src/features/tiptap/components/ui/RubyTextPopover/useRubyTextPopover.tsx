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
import { BsTranslate } from 'react-icons/bs';

/** ルビショートカットキー */
export const RUBY_TEXT_SHORTCUT_KEY = 'mod+shift+r';
/** ルビ機能の設定 */
export interface UseRubyConfig {
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
   * ルビ設定時に呼び出されるコールバック関数
   */
  onSetRubyText?: () => void;
}

/**
 * 現在のエディター状態で、マークの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type マーク種別
 */
export const canSetRubyText = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (
    !isMarkInSchema('rubyText', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().setRubyText({ rt: 'test' });
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

  if (!isNodeInSchema('rubyText', editor)) return false;

  if (!editor.isActive('code')) {
    return canSetRubyText(editor);
  }

  return true;
};
/**
 * ルビテキスト解除処理
 * @param editor Tiptapエディターのインスタンス
 * @returns true:成功、flase:失敗
 */
export const unsetRubyText = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canSetRubyText(editor)) return false;

  return editor.chain().focus().unsetRubyText().run();
};

/**
 * ルビテキストハンドラー用のカスタムフック
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.onSetRubyText ルビテキスト設定時のコールバック関数
 * @returns ハンドラー各種
 */
export const useRubyTextHandler = (props: {
  editor: Editor | null;
  onSetRubyText?: () => void;
}) => {
  const { editor, onSetRubyText } = props;
  const [rubyText, setRubyText] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    const { rt } = editor.getAttributes('rubyText');

    if (editor.isActive('rubyText') && rubyText === null) {
      setRubyText(rt || '');
    }
  }, [editor, rubyText]);

  useEffect(() => {
    if (!editor) return;

    const updateLinkState = () => {
      const { rt } = editor.getAttributes('rubyText');
      setRubyText(rt || '');
    };

    editor.on('selectionUpdate', updateLinkState);
    return () => {
      editor.off('selectionUpdate', updateLinkState);
    };
  }, [editor]);

  const setRuby = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetRubyText(editor)) return false;

    const success = editor.chain().focus().setRubyText({ rt: rubyText }).run();
    if (success) {
      onSetRubyText?.();
    }
    return success;
  }, [editor, onSetRubyText, rubyText]);

  const removeRuby = useCallback(() => {
    if (!editor) return false;
    const success = unsetRubyText(editor);
    if (success) {
      onSetRubyText?.();
    }
    return success;
  }, [editor, onSetRubyText]);

  return {
    rubyText: rubyText || '',
    setRubyText,
    setRuby,
    removeRuby,
  };
};

/**
 * Tiptapエディター向けのルビ機能を提供するカスタムフック。
 * @param config ルビ機能の設定
 */
export const useRubyText = (config: UseRubyConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSetRubyText,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canSet = canSetRubyText(editor);
  const isActive = editor?.isActive('rubyText') || false;

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
  const rubyTextHandler = useRubyTextHandler({
    editor,
    onSetRubyText,
  });

  return {
    isVisible,
    isActive,
    canSet,
    label: 'rubyText',
    shortcutKeys: RUBY_TEXT_SHORTCUT_KEY,
    Icon: BsTranslate,
    ...rubyTextHandler,
  };
};

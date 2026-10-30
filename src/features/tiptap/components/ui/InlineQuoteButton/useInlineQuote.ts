import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isMarkInSchema,
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsQuote } from 'react-icons/bs';

export const INLINE_QUOTE_SHORTCUT_KEY = 'mod+shift+q';

export interface UseInlineQuoteConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

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

export const toggleInlineQuote = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleInlineQuote(editor)) return false;

  return editor.chain().focus().toggleInlineQuote().run();
};

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

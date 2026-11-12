import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isMarkInSchema,
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsTranslate } from 'react-icons/bs';

export const RUBY_TEXT_SHORTCUT_KEY = 'mod+shift+r';
export interface UseRubyConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onSetRubyText?: () => void;
}

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

export const unsetRubyText = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canSetRubyText(editor)) return false;

  return editor.chain().focus().unsetRubyText().run();
};
export interface RubyTextHandlerProps {
  editor: Editor | null;
  onSetRubyText?: () => void;
}

export const useRubyTextHandler = (props: RubyTextHandlerProps) => {
  const { editor, onSetRubyText } = props;
  const [rubyText, setRubyText] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    // Get URL immediately on mount
    const { href } = editor.getAttributes('link');

    if (editor.isActive('rubyText') && rubyText === null) {
      setRubyText(href || '');
    }
  }, [editor, rubyText]);

  useEffect(() => {
    if (!editor) return;

    const updateLinkState = () => {
      const { href } = editor.getAttributes('link');
      setRubyText(href || '');
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
  }, [editor, onSetRubyText]);

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

export const useRubyTextPopover = (config: UseRubyConfig) => {
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

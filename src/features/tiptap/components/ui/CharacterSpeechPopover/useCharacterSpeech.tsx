import { CharacterSpeechAttributes } from '@/features/tiptap/components/extension/CharacterSpeech';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsChatFill } from 'react-icons/bs';

export interface UseCharacterSpeechConfig {
  editor?: Editor | null;

  hideWhenUnavailable?: boolean;

  onSetCharacterSpeech?: () => void;
}

export const canSetCharacterSpeech = (editor: Editor | null) => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isNodeInSchema('characterSpeech', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().setCharacterSpeech({
    image: 'hogehoge',
    text: 'hogehoge',
    position: 'left',
  });
};

export const isCharacterSpeechActive = (editor: Editor | null) => {
  if (!editor || !editor.isEditable) return false;

  return editor.isActive('characterSpeech');
};

export const shouldShowLinkButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  const characterSpeechInSchema = isNodeInSchema('characterSpeech', editor);

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!characterSpeechInSchema) {
    return false;
  }

  if (!editor.isActive('code')) {
    return canSetCharacterSpeech(editor);
  }

  return true;
};

export interface CharacterSpeechHandlerProps {
  editor: Editor | null;
  onSetCharacterSpeech?: () => void;
}

export const useCharacterSpeechHandler = (
  props: CharacterSpeechHandlerProps
) => {
  const { editor, onSetCharacterSpeech } = props;
  const [characterSpeechState, setCharacterSpeechState] =
    useState<CharacterSpeechAttributes | null>(null);

  useEffect(() => {
    if (!editor) return;

    const { image, text, position } = editor.getAttributes('characterSpeech');
    if (isCharacterSpeechActive(editor) && characterSpeechState === null) {
      setCharacterSpeechState({ image, text, position });
    }
  }, [editor, characterSpeechState]);

  useEffect(() => {
    if (!editor) return;

    const updateCharacterSpeechState = () => {
      const { image, text, position } = editor.getAttributes('characterSpeech');
      setCharacterSpeechState({ image, text, position });
    };

    editor.on('selectionUpdate', updateCharacterSpeechState);
    return () => {
      editor.off('selectionUpdate', updateCharacterSpeechState);
    };
  }, [editor]);

  const insertCharacterSpeech = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetCharacterSpeech(editor)) return false;

    return editor.chain().focus().insertContent({
      type: 'characterSpeech',
    });
  }, [editor]);

  const setCharacterSpeech = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetCharacterSpeech(editor)) return false;

    if (!characterSpeechState) return false;

    const { selection } = editor.state;
    const isEmpty = selection.empty;

    let chain = editor.chain().focus();

    chain = chain
      .extendMarkRange('characterSpeech')
      .setCharacterSpeech(characterSpeechState);

    if (isEmpty) {
      chain = chain.insertContent({
        type: 'text',
        attributes: characterSpeechState,
      });
    }
    chain.run();

    setCharacterSpeechState(null);
    onSetCharacterSpeech?.();
  }, [editor, onSetCharacterSpeech, characterSpeechState]);

  const removeCharacterSpeech = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .extendMarkRange('characterSpeech')
      .removeCharacterSpeech()
      .run();
    setCharacterSpeechState(null);
  }, [editor]);

  return {
    characterSpeechState: characterSpeechState ?? {
      image: '',
      text: '',
      position: 'left',
    },
    setCharacterSpeechState,
    insertCharacterSpeech,
    setCharacterSpeech,
    removeCharacterSpeech,
  };
};

export const useCharacterSpeech = (config?: UseCharacterSpeechConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSetCharacterSpeech,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);

  const canSet = canSetCharacterSpeech(editor);
  const isActive = isCharacterSpeechActive(editor);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowLinkButton({
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

  const characterSpeechHandler = useCharacterSpeechHandler({
    editor,
    onSetCharacterSpeech,
  });

  return {
    isVisible,
    canSet,
    isActive,
    label: 'CharacterSpeech',
    Icon: BsChatFill,
    ...characterSpeechHandler,
  };
};

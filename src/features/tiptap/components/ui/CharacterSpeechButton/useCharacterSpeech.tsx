import { CharacterSpeechAttributes } from '@/features/tiptap/components/extension/CharacterSpeech';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsChatFill } from 'react-icons/bs';

/**
 * キャラクタースピーチ機能の設定
 */
export interface UseCharacterSpeechConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * キャラクタースピーチ機能が使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * キャラクタースピーチの設定が正常に完了した後に呼び出されるコールバック関数
   */
  onSetCharacterSpeech?: () => void;
}

/**
 * 現在のエディター状態で、キャラクタースピーチへの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param turnInfo キャラクタースピーチへの変換時に追加の判定を行うかどうか
 */
export const canSetCharacterSpeech = (editor: Editor | null) => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isNodeInSchema('characterSpeech', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().insertCharacterSpeech();
};

/**
 * Tiptapエディター内で現在キャラクタースピーチがアクティブかチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns true:アクティブ、false:非アクティブ
 */
export const isCharacterSpeechActive = (editor: Editor | null) => {
  if (!editor || !editor.isEditable) return false;

  return editor.isActive('characterSpeech');
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

/**
 * キャラクタースピーチの各種ハンドラーを提供するためのカスタムフック
 */
export const useCharacterSpeechHandler = (props: {
  editor: Editor | null;
  onSetCharacterSpeech?: () => void;
}) => {
  const { editor, onSetCharacterSpeech } = props;
  const [characterSpeechState, setCharacterSpeechState] =
    useState<CharacterSpeechAttributes | null>(null);

  useEffect(() => {
    if (!editor) return;

    const { characterIcon, characterName, characterPosition, frameColor } =
      editor.getAttributes('characterSpeech');
    if (isCharacterSpeechActive(editor) && characterSpeechState === null) {
      setCharacterSpeechState({
        characterIcon,
        characterName,
        characterPosition,
        frameColor,
      });
    }
  }, [editor, characterSpeechState]);

  useEffect(() => {
    if (!editor) return;

    const updateCharacterSpeechState = () => {
      const { characterIcon, characterName, characterPosition, frameColor } =
        editor.getAttributes('characterSpeech');
      setCharacterSpeechState({
        characterIcon,
        characterName,
        characterPosition,
        frameColor,
      });
    };

    editor.on('selectionUpdate', updateCharacterSpeechState);
    return () => {
      editor.off('selectionUpdate', updateCharacterSpeechState);
    };
  }, [editor]);

  const insertCharacterSpeech = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetCharacterSpeech(editor)) return false;
    const success = editor.chain().focus().insertCharacterSpeech().run();
    if (!success) {
      return;
    }
    onSetCharacterSpeech?.();
    return true;
  }, [editor]);

  const setCharacterSpeech = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetCharacterSpeech(editor)) return false;

    let chain = editor.chain().focus();

    chain = chain.setCharacterSpeech(characterSpeechState ?? {});

    chain.run();

    setCharacterSpeechState(null);
    onSetCharacterSpeech?.();
    return true;
  }, [editor, onSetCharacterSpeech, characterSpeechState]);

  const removeCharacterSpeech = useCallback(() => {
    if (!editor) return false;
    editor
      .chain()
      .focus()
      .removeCharacterSpeech()
      .setMeta('preventAutolink', true)
      .run();
    setCharacterSpeechState({});
    return true;
  }, [editor]);

  return {
    characterSpeechState,
    insertCharacterSpeech,
    setCharacterSpeechState,
    setCharacterSpeech,
    removeCharacterSpeech,
  };
};

/**
 * Tiptapエディター向けのキャラクタースピーチ機能を提供するカスタムフック。
 *
 * @param config キャラクタースピーチ機能の設定
 */
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
        shouldShowButton({
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

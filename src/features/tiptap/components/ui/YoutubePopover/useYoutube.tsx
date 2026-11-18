'use client';

import { Size } from '@/common/type';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { BsYoutube } from 'react-icons/bs';

// --- Libs ---
import {
  isNodeInSchema,
  isNodeTypeSelected,
  sanitizeUrl,
} from '@/features/tiptap/lib/tiptapUtils';

export type SetYoutubeVideoOptions = {
  src: string;
  width?: number | string;
  height?: number | string;
  start?: number;
};
/**
 * Youtubeデフォルトサイズ設定
 */
export const YOUTUBE_DEFAULT_SIZE: Size = {
  width: 600,
  height: 400,
};

/**
 * Youtube機能の設定
 */
export interface UseYoutubeConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * Youtube機能が使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * Youtubeの設定が正常に完了した後に呼び出されるコールバック関数
   */
  onSetYoutube?: () => void;
}

/**
 * 現在のエディター状態で、Youtubeの設定が可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns true:利用可、false:利用不可
 */
export const canSetYoutube = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isNodeInSchema('youtube', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().setYoutubeVideo({
    src: 'https://www.youtube.com/hogehoge',
    ...YOUTUBE_DEFAULT_SIZE,
  });
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

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isActive('code')) {
    return canSetYoutube(editor);
  }

  return true;
};

/**
 * Youtube機能用ハンドラーのカスタムフック
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.onSetYotuube Youtube設定完了時のコールバック関数
 * @returns Youtube機能用ハンドラー各種
 */
export const useYoutubeHandler = (props: {
  editor: Editor | null;
  onSetYoutube?: () => void;
}) => {
  const { editor, onSetYoutube } = props;
  const [youtubeState, setYoutubeState] =
    useState<SetYoutubeVideoOptions | null>(null);

  useEffect(() => {
    if (!editor) return;

    const { src, width, height } = editor.getAttributes('youtube');
    if (editor.isActive('youtube') && youtubeState === null) {
      setYoutubeState({
        src: src ?? '',
        width: width ?? YOUTUBE_DEFAULT_SIZE.width,
        height: height ?? YOUTUBE_DEFAULT_SIZE.height,
      });
    }
  }, [editor, youtubeState]);

  useEffect(() => {
    if (!editor) return;

    const updateYoutubeState = () => {
      const { src, width, height } = editor.getAttributes('youtube');
      setYoutubeState({
        src: src ?? '',
        width: width ?? YOUTUBE_DEFAULT_SIZE.width,
        height: height ?? YOUTUBE_DEFAULT_SIZE.height,
      });
    };

    editor.on('selectionUpdate', updateYoutubeState);
    return () => {
      editor.off('selectionUpdate', updateYoutubeState);
    };
  }, [editor]);

  const setYoutube = useCallback(() => {
    if (!youtubeState || !editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setYoutubeVideo({
        src: youtubeState.src ?? '',
        width: youtubeState.width ?? YOUTUBE_DEFAULT_SIZE.width,
        height: youtubeState.height ?? YOUTUBE_DEFAULT_SIZE.height,
      })
      .run();

    setYoutubeState(null);

    onSetYoutube?.();
  }, [editor, onSetYoutube, youtubeState]);

  const openYoutube = useCallback(() => {
    if (!youtubeState?.src) return;

    const safeUrl = sanitizeUrl(youtubeState.src, window.location.href);
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  }, [youtubeState?.src]);

  return {
    youtubeState: youtubeState || { ...YOUTUBE_DEFAULT_SIZE, src: '' },
    setYoutubeState,
    setYoutube,
    openYoutube,
  };
};

/**
 * Tiptapエディター向けのYotuube機能を提供するカスタムフック。
 *
 * @param config Youtube機能の設定
 */
export const useYoutube = (config?: UseYoutubeConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSetYoutube,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);

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
  const isActive = editor?.isActive('youtube') || false;
  const canSet = canSetYoutube(editor);

  const youtubeHandler = useYoutubeHandler({
    editor,
    onSetYoutube,
  });

  return {
    isVisible,
    canSet,
    isActive,
    label: 'Youtube',
    Icon: BsYoutube,
    ...youtubeHandler,
  };
};

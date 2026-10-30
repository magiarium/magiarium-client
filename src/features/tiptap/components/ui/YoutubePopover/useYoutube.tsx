import { Size } from '@/common/type';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isNodeInSchema,
  isNodeTypeSelected,
  sanitizeUrl,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsYoutube } from 'react-icons/bs';

export const YOUTUBE_DEFAULT_SIZE: Size = {
  width: 600,
  height: 400,
};

export interface YoutubeAttributes {
  src: string;
  height: number;
  width: number;
}

export interface UseYoutubeConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onSetYoutube?: () => void;
}

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

export interface YoutubeHandlerProps {
  editor: Editor | null;
  onSetYoutube?: () => void;
}
export const useYoutubeHandler = (props: YoutubeHandlerProps) => {
  const { editor, onSetYoutube } = props;
  const [youtubeState, setYoutubeState] = useState<YoutubeAttributes | null>(
    null
  );

  useEffect(() => {
    if (!editor) return;

    const { src, width, height } = editor.getAttributes('youtube');
    if (editor?.isActive('youtube') && youtubeState === null) {
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

    editor.chain().focus().setYoutubeVideo(youtubeState).run();

    setYoutubeState(null);

    onSetYoutube?.();
  }, [editor, onSetYoutube, youtubeState]);

  const openYoutube = useCallback(() => {
    if (!youtubeState?.src) return;

    const safeUrl = sanitizeUrl(youtubeState.src, window.location.href);
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  }, [youtubeState?.src]);

  return {
    youtubeState: youtubeState || { src: '', ...YOUTUBE_DEFAULT_SIZE },
    setYoutubeState,
    setYoutube,
    openYoutube,
  };
};

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

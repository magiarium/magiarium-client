import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isNodeInSchema,
  isNodeTypeSelected,
  sanitizeUrl,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsCardText } from 'react-icons/bs';
import { LinkCardAttributes } from '../../extension/LinkCard';

export const LINKCARD_SHORTCUT_KEY = 'mod+shift+l+c';

export interface UseLinkCardConfig {
  editor?: Editor | null;

  hideWhenUnavailable?: boolean;

  onSetLinkCard?: () => void;
}

export const canSetLinkCard = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isNodeInSchema('linkCard', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().setLinkCard({
    title: 'test',
    thumbnailUrl: '/hogehoge.jpg',
    linkUrl: 'https://magiarium.info',
    target: '_blank',
  });
};

export const shouldShowButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  const linkCardInSchema = isNodeInSchema('linkCard', editor);

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!linkCardInSchema) {
    return false;
  }

  if (!editor.isActive('code')) {
    return canSetLinkCard(editor);
  }

  return true;
};

export interface LinkCardHandlerProps {
  editor: Editor | null;
  onSetLinkCard?: () => void;
}
export const useLinkCardHandlers = (props: LinkCardHandlerProps) => {
  const { editor, onSetLinkCard } = props;
  const [linkCardState, setLinkCardState] = useState<LinkCardAttributes | null>(
    null
  );

  useEffect(() => {
    if (!editor) return;

    const { thumbnailUrl, title, linkUrl, target } =
      editor.getAttributes('linkCard');
    if (editor.isActive('linkCard') && linkCardState === null) {
      setLinkCardState({ thumbnailUrl, title, linkUrl, target });
    }
  }, [editor, linkCardState]);

  useEffect(() => {
    if (!editor) return;

    const updateLinkCardState = () => {
      const { thumbnailUrl, title, linkUrl, target } =
        editor.getAttributes('linkCard');
      setLinkCardState({ thumbnailUrl, title, linkUrl, target });
    };
    editor.on('selectionUpdate', updateLinkCardState);
    return () => {
      editor.off('selectionUpdate', updateLinkCardState);
    };
  }, [editor]);

  const insertLinkCard = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetLinkCard(editor)) return false;

    return editor.chain().focus().insertContent({
      type: 'linkCard',
    });
  }, [editor]);

  const setLinkCard = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetLinkCard(editor)) return false;

    if (!linkCardState) return false;

    const { selection } = editor.state;
    const isEmpty = selection.empty;

    let chain = editor.chain().focus();
    chain = chain.extendMarkRange('linkCard').setLinkCard(linkCardState);

    if (isEmpty) {
      chain = chain.insertContent({
        type: 'text',
        attributes: linkCardState,
      });
    }
    chain.run();
    setLinkCardState(null);

    onSetLinkCard?.();
  }, [editor, onSetLinkCard, linkCardState]);

  const removeLinkCard = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .extendMarkRange('linkCard')
      .unsetLinkCard()
      .setMeta('preventAutolink', true)
      .run();
    setLinkCardState({
      thumbnailUrl: '',
      target: '_blank',
      title: '',
      linkUrl: '',
    });
  }, [editor]);

  const openLink = useCallback(
    (target: string = '_blank', features: string = 'noopener,noreferrer') => {
      const url = linkCardState?.linkUrl;
      if (!url) return;

      const safeUrl = sanitizeUrl(url, window.location.href);
      if (safeUrl !== '#') {
        window.open(safeUrl, target, features);
      }
    },
    [linkCardState?.linkUrl]
  );

  return {
    linkCardState: linkCardState || {
      thumbnailUrl: '',
      target: '_blank',
      title: '',
      linkUrl: '',
    },
    setLinkCardState,
    setLinkCard,
    insertLinkCard,
    removeLinkCard,
    openLink,
  };
};

export const useLinkCard = (config?: UseLinkCardConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSetLinkCard,
  } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canSet = canSetLinkCard(editor);
  const isActive = editor?.isActive('linkCard') || false;

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const linkCardHandlers = useLinkCardHandlers({
    editor,
    onSetLinkCard,
  });

  return {
    isVisible,
    isActive,
    canSet,
    label: 'linkCard',
    shortcutKeys: LINKCARD_SHORTCUT_KEY,
    Icon: BsCardText,
    ...linkCardHandlers,
  };
};

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

/**
 * リンクカードショートカットキー
 */
export const LINKCARD_SHORTCUT_KEY = 'mod+shift+l+c';

/**
 * リンクカード機能の設定
 */
export interface UseLinkCardConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * InlineLink引用機能が使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * Linkの設定が正常に完了した後に呼び出されるコールバック関数
   */
  onSetLinkCard?: () => void;
}

/**
 * 現在のエディター状態で、Linkの設定が可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns true:利用可、false:利用不可
 */
export const canSetLinkCard = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isNodeInSchema('linkCard', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().setLinkCard({
    href: 'https://magiarium.info',
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

/**
 * Tiptapエディター向けのLinkCard機能を提供するカスタムフック。
 */
export const useLinkCardHandlers = (props: {
  editor: Editor | null;
  onSetLinkCard?: () => void;
}) => {
  const { editor, onSetLinkCard } = props;
  const [linkCardState, setLinkCardState] = useState<LinkCardAttributes | null>(
    null
  );

  useEffect(() => {
    if (!editor) return;

    const { thumbnailUrl, title, href, target, description } =
      editor.getAttributes('linkCard');
    if (editor.isActive('linkCard') && linkCardState === null) {
      setLinkCardState({ thumbnailUrl, title, href, target, description });
    }
  }, [editor, linkCardState]);

  useEffect(() => {
    if (!editor) return;

    const updateLinkCardState = () => {
      const { thumbnailUrl, title, href, target, description } =
        editor.getAttributes('linkCard');
      setLinkCardState({ thumbnailUrl, title, href, target, description });
    };
    editor.on('selectionUpdate', updateLinkCardState);
    return () => {
      editor.off('selectionUpdate', updateLinkCardState);
    };
  }, [editor]);

  const setLinkCard = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetLinkCard(editor)) return false;

    const { selection } = editor.state;
    const isEmpty = selection.empty;

    let chain = editor.chain().focus();
    chain = chain.setLinkCard(
      linkCardState ?? {
        href: '',
      }
    );

    if (isEmpty) {
      chain = chain.insertContent({
        type: 'linkCard',
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
      .unsetLinkCard()
      .setMeta('preventAutolink', true)
      .run();
    setLinkCardState({
      href: '',
    });
  }, [editor]);

  const openLink = useCallback(
    (target: string = '_blank', features: string = 'noopener,noreferrer') => {
      const url = linkCardState?.href;
      if (!url) return;

      const safeUrl = sanitizeUrl(url, window.location.href);
      if (safeUrl !== '#') {
        window.open(safeUrl, target, features);
      }
    },
    [linkCardState?.href]
  );

  return {
    linkCardState: linkCardState || {
      href: '',
    },
    setLinkCardState,
    setLinkCard,
    removeLinkCard,
    openLink,
  };
};
/**
 * Tiptapエディター向けのLinkCardを提供するカスタムフック。
 * @param config 引用ブロック機能の設定
 */
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

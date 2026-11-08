'use client';

import type { InlineLinkAttributes } from '@/features/tiptap/components/extension/InlineLink';
import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { BsLink45Deg } from 'react-icons/bs';

// --- Lib ---
import {
  isMarkInSchema,
  isNodeTypeSelected,
  sanitizeUrl,
} from '@/features/tiptap/lib/tiptapUtils';

/**
 * LinkPopover機能の設定
 */
export interface UseLinkPopoverConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * LinkPopover引用機能が使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * Linkの設定が正常に完了した後に呼び出されるコールバック関数
   */
  onSetInlineLink?: () => void;
}

/**
 * Link機能の設定
 */
export interface LinkHandlerProps {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor: Editor | null;

  /**
   * Linkの設定が正常に完了した後に呼び出されるコールバック関数
   */
  onSetInlineLink?: () => void;
}

/**
 * 現在のエディター状態で、Linkの設定が可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 */
export const canSetInlineLink = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  // テキスト選択範囲が画像キャプション内にあるかどうかを第3引数の true で判定し、画像キャプション内ではリンクの設定を禁止する
  if (isNodeTypeSelected(editor, ['image'], true)) return false;
  try {
    return editor.can().setMark('link');
  } catch {
    return false;
  }
};

/**
 * 現在のエディターからLinkがアクティブ状態かチェックする
 *
 * @editor Tiptapエディターのインスタンス
 * @return true:アクティブ状態、false:非アクティブ状態
 */
export const isInlineLinkActive = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive('link');
};

/**
 * ボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable 対象機能が使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export const shouldShowInlineLinkButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  const linkInSchema = isMarkInSchema('link', editor);

  // hideWhenUnavailable が false の場合、ボタンが利用できない状態であっても、ボタン自体は常に画面に表示する
  if (!hideWhenUnavailable) {
    return true;
  }

  // hideWhenUnavailable が true の場合、リンクがスキーマ（schema）に定義されていなければ、ボタンを非表示にする
  if (!linkInSchema) {
    return false;
  }

  // hideWhenUnavailable が trueの場合、リンクを設定できない状態であればボタンを非表示にする（ただしコードブロック内は例外とする）
  if (!editor.isActive('code')) {
    return canSetInlineLink(editor);
  }

  return true;
};

/**
 * Tiptapエディター向けのLink機能を提供するカスタムフック。
 */
export const useInlineLinkHandler = (props: LinkHandlerProps) => {
  const { editor, onSetInlineLink } = props;
  const [inlineLinkState, setInlineLinkState] =
    useState<InlineLinkAttributes | null>(null);

  useEffect(() => {
    if (!editor) return;

    // Get URL immediately on mount
    const { href, icon, target } = editor.getAttributes('link');

    if (isInlineLinkActive(editor) && inlineLinkState === null) {
      setInlineLinkState({
        href: href || '',
        icon,
        target: target || '別タブ',
      });
    }
  }, [editor, inlineLinkState]);

  useEffect(() => {
    if (!editor) return;

    const updateLinkState = () => {
      const { href, icon, target } = editor.getAttributes('link');
      setInlineLinkState({
        href: href,
        icon,
        target: target || '別タブ',
      });
    };

    editor.on('selectionUpdate', updateLinkState);
    return () => {
      editor.off('selectionUpdate', updateLinkState);
    };
  }, [editor]);

  const setInlineLink = useCallback(() => {
    if (!inlineLinkState || !editor) return;

    const { selection } = editor.state;
    const isEmpty = selection.empty;

    let chain = editor.chain().focus();

    chain = chain.extendMarkRange('link').setInlineLink(inlineLinkState);

    if (isEmpty) {
      chain = chain.insertContent({ type: 'text', text: inlineLinkState.href });
    }

    chain.run();

    setInlineLinkState(null);

    onSetInlineLink?.();
  }, [editor, onSetInlineLink, inlineLinkState]);

  const removeInlineLink = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetInlineLink()
      .setMeta('preventAutolink', true)
      .run();
    setInlineLinkState({
      href: '',
    });
  }, [editor]);

  const openLink = useCallback(
    (target: string = '_blank', features: string = 'noopener,noreferrer') => {
      if (!inlineLinkState) return;

      const safeUrl = sanitizeUrl(inlineLinkState.href, window.location.href);
      if (safeUrl !== '#') {
        window.open(safeUrl, target, features);
      }
    },
    [inlineLinkState]
  );

  return {
    inlineLinkState: inlineLinkState || { href: '' },
    setInlineLinkState,
    setInlineLink,
    removeInlineLink,
    openLink,
  };
};

/**
 * Linkポップオーバーの状態を管理するためのカスタムフック
 *
 * @param editor tiptapエディターのインスタンス
 * @param hideWhenUnavailable 対象機能が使用できない場合に、ボタンを非表示にするかどうか。
 */
export const useLinkState = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}) => {
  const { editor, hideWhenUnavailable = false } = props;

  const canSet = canSetInlineLink(editor);
  const isActive = isInlineLinkActive(editor);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowInlineLinkButton({
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

  return {
    isVisible,
    canSet,
    isActive,
  };
};

/**
 * Tiptapエディター向けのLinkPopoverを提供するカスタムフック。
 * @param config 引用ブロック機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法
 * function MyLinkButton() {
 *   const { isVisible, canSet, isActive, Icon, label } = useLinkPopover()
 *
 *   if (!isVisible) return null
 *
 *   return <button disabled={!canSet}>Link</button>
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedLinkButton() {
 *   const { isVisible, canSet, isActive, Icon, label } = useLinkPopover({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onSetLink: () => console.log('Linkを設定しました。')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       disabled={!canSet}
 *       aria-label={label}
 *       aria-pressed={isActive}
 *     >
 *       <Icon />
 *       {label}
 *     </MyButton>
 *   )
 * }
 * ```
 */
export const useInlineLinkPopover = (config?: UseLinkPopoverConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSetInlineLink,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);

  const { isVisible, canSet, isActive } = useLinkState({
    editor,
    hideWhenUnavailable,
  });

  const inlineLinkHandler = useInlineLinkHandler({
    editor,
    onSetInlineLink,
  });

  return {
    isVisible,
    canSet,
    isActive,
    label: 'InlineLink',
    Icon: BsLink45Deg,
    ...inlineLinkHandler,
  };
};

'use client';

import type { ChainedCommands } from '@tiptap/react';
import { type Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import {
  isExtensionAvailable,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';

// --- Icons ---
import { AlignCenterIcon } from '@/features/tiptap/components/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/features/tiptap/components/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/features/tiptap/components/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/features/tiptap/components/icons/AlignRightIcon';

export const TEXT_ALIGN = ['left', 'center', 'right', 'justify'] as const;
export type TextAlign = (typeof TEXT_ALIGN)[number];

/**
 * TextAlign機能の設定
 */
export interface UseTextAlignConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * 適用するTextAlign
   */
  align: TextAlign;

  /**
   * TextAlign機能が使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * TextAlign適用が正常に完了した場合に呼び出されるコールバック関数
   */
  onAligned?: () => void;
}

/**
 * TextAlignショートカットキー一覧
 */
export const TEXT_ALIGN_SHORTCUT_KEYS: Record<TextAlign, string> = {
  left: 'mod+shift+l',
  center: 'mod+shift+e',
  right: 'mod+shift+r',
  justify: 'mod+shift+j',
};

/**
 * TextAlignアイコン一覧
 */
export const textAlignIcons = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};

/**
 * TextAlignラベル一覧
 */
export const textAlignLabels: Record<TextAlign, string> = {
  left: '左寄せ',
  center: '中央寄せ',
  right: '右寄せ',
  justify: '整列',
};

/**
 * 現在のエディター状態で、TextAlignの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param align 適用するTextAlign
 */
export const canSetTextAlign = (
  editor: Editor | null,
  align: TextAlign
): boolean => {
  if (!editor || editor.isDestroyed || !editor.isEditable) return false;
  if (
    !isExtensionAvailable(editor, 'textAlign') ||
    isNodeTypeSelected(editor, ['image', 'horizontalRule'])
  )
    return false;

  try {
    return editor.can().setTextAlign(align);
  } catch {
    return false;
  }
};

/**
 * 指定されたコマンドが `setTextAlign` メソッドを持つかどうかを判定する。
 *
 * @param commands - 判定対象のチェーンコマンド。
 * @returns `setTextAlign` メソッドを持つ場合は `true`、それ以外は `false`。
 */
export const hasSetTextAlign = (
  commands: ChainedCommands
): commands is ChainedCommands & {
  setTextAlign: (align: TextAlign) => ChainedCommands;
} => {
  return 'setTextAlign' in commands;
};

/**
 * 指定されたTextAlignが現在アクティブ状態かチェックする処理
 * @param editor Tiptapエディターのインスタンス
 * @param align TextAlign
 * @return true:アクティブ状態、false:非アクティブ状態
 */
export const isTextAlignActive = (
  editor: Editor | null,
  align: TextAlign
): boolean => {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive({ textAlign: align });
};

/**
 * 現在アクティブ状態のtextAlign情報の型定義
 */
export type ActiveTextAlignInfo = {
  /**
   * アクティブ状態
   */
  isActive: boolean;

  /**
   * 現在アクティブ状態のTextAlign
   */
  activeTextAlign?: TextAlign;
};

/**
 * 現在アクティブ状態のtextAlignを取得する処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns アクティブ情報
 */
export const getActiveTextAlignInfo = (
  editor: Editor | null
): ActiveTextAlignInfo => {
  if (!editor || !editor.isEditable) return { isActive: false };

  const activeTextAlign = TEXT_ALIGN.find((textAlign) =>
    editor.isActive({ textAlign })
  );

  return activeTextAlign
    ? { isActive: true, activeTextAlign: activeTextAlign }
    : { isActive: false };
};

/**
 * エディターに指定されたTextAlignを設定する処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param align 設定するTextAlign
 * @return true:設定成功, false:設定失敗
 */
export const setTextAlign = (
  editor: Editor | null,
  align: TextAlign
): boolean => {
  if (!editor || editor.isDestroyed || !editor.isEditable) return false;
  if (!canSetTextAlign(editor, align)) return false;

  try {
    const chain = editor.chain().focus();
    if (hasSetTextAlign(chain)) {
      return chain.setTextAlign(align).run();
    }
  } catch {
    return false;
  }

  return false;
};

/**
 * ボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable 対象機能が使用できない場合に、ボタンを非表示にするかどうか。
 * @param props.align 使用したいTextAlign
 * @returns false:表示する, true:非表示
 */
export const shouldShowButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
  align: TextAlign;
}): boolean => {
  const { editor, hideWhenUnavailable, align } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isExtensionAvailable(editor, 'textAlign')) return false;

  if (!editor.isActive('code')) {
    return canSetTextAlign(editor, align);
  }

  return true;
};

/**
 * Tiptapエディター向けのTextAlign機能を提供するカスタムフック。
 * @param config TextAlign機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MySimpleAlignButton() {
 *   const { isVisible, handleTextAlign } = useTextAlign({ align: "center" })
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleTextAlign}>Align Center</button>
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedAlignButton() {
 *   const { isVisible, handleTextAlign, label, isActive } = useTextAlign({
 *     editor: myEditor,
 *     align: "right",
 *     hideWhenUnavailable: true,
 *     onAligned: () => console.log('TextAlign適用完了')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleTextAlign}
 *       aria-pressed={isActive}
 *       aria-label={label}
 *     >
 *       Align Right
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useTextAlign(config: UseTextAlignConfig) {
  const {
    editor: providedEditor,
    align,
    hideWhenUnavailable = false,
    onAligned,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canAlign = canSetTextAlign(editor, align);
  const isActive = isTextAlignActive(editor, align);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, align, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, align]);

  const handleTextAlign = useCallback(() => {
    if (!editor) return false;

    const success = setTextAlign(editor, align);
    if (success) {
      onAligned?.();
    }
    return success;
  }, [editor, align, onAligned]);

  return {
    isVisible,
    isActive,
    handleTextAlign,
    canAlign,
    label: textAlignLabels[align],
    shortcutKeys: TEXT_ALIGN_SHORTCUT_KEYS[align],
    Icon: textAlignIcons[align],
  };
}

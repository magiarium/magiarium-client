'use client';

import { type Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

// --- Hooks ---
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import { isExtensionAvailable } from '@/features/tiptap/lib/tiptapUtils';

// --- Icons ---
import { ImagePlusIcon } from '@/features/tiptap/components/icons/ImagePlusIcon';

export const IMAGE_UPLOAD_SHORTCUT_KEY = 'mod+shift+i';

/**
 * 画像アップロード機能の設定
 */
export interface UseImageUploadConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * 引用ブロックが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * 画像追加成功時に呼び出されるコールバック関数
   */
  onInserted?: () => void;
}

/**

/**
 * 現在のエディター状態で、画像が追加可能かかどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 */
export const canInsertImage = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  // アップロード拡張機能を持たないエディターも正常にサポートされるが、ボタンは`hideWhenUnavailable` によって非表示になる仕様
  if (!isExtensionAvailable(editor, 'imageUpload', { silent: true }))
    return false;

  return editor.can().insertContent({ type: 'imageUpload' });
};

/**
 * 画像が現在アクティブ状態かチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @return true:アクティブ状態、false:非アクティブ状態
 */
export const isImageActive = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive('imageUpload');
};

/**
 * エディターの画像機能を切り替える処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @return true:成功、false:失敗
 */
export const toggleImage = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertImage(editor)) return false;

  try {
    const chain = editor.chain().focus();

    if (editor.isActive('imageUpload')) {
      return chain.deleteImageUploadNode().run();
    }

    if (editor.isActive('image')) {
      chain.deleteImageFigure().run();
    }

    return editor
      .chain()
      .focus()
      .insertContent({
        type: 'imageUpload',
      })
      .run();
  } catch {
    return false;
  }
};

export const deleteImage = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertImage(editor)) return false;
  try {
    const chain = editor.chain().focus();

    return chain.deleteImageFigure().run();
  } catch {
    return false;
  }
};

/**
 * ボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable 対象機能が使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  // Silent by intent: `hideWhenUnavailable` means "absence is fine, just
  // don't render" — see canInsertImage.
  if (!isExtensionAvailable(editor, 'imageUpload', { silent: true }))
    return false;

  if (!editor.isActive('code')) {
    return canInsertImage(editor);
  }

  return true;
}

/**
 * Tiptapエディター向けの画像アップロード機能を提供するカスタムフック。
 * @param config 画像アップロード機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MySimpleImageButton() {
 *   const { isVisible, handleImage } = useImage()
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleImage}>Add Image</button>
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedImageButton() {
 *   const { isVisible, handleImage, label, isActive } = useImage({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onInserted: () => console.log('画像追加完了')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleImage}
 *       aria-pressed={isActive}
 *       aria-label={label}
 *     >
 *       画像を追加する
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useImageUpload(config?: UseImageUploadConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertImage(editor);
  const isActive = isImageActive(editor);

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

  const handleImage = useCallback(() => {
    if (!editor) return false;

    const success = toggleImage(editor);
    if (success) {
      onInserted?.();
    }
    return success;
  }, [editor, onInserted]);

  useHotkeys(
    IMAGE_UPLOAD_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleImage();
    },
    {
      enabled: isVisible && canInsert,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  );

  return {
    isVisible,
    isActive,
    handleImage,
    canInsert,
    label: 'Add image',
    shortcutKeys: IMAGE_UPLOAD_SHORTCUT_KEY,
    Icon: ImagePlusIcon,
  };
}

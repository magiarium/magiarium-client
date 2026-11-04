import type { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { HeadingIcon } from '@/features/tiptap/components/icons/HeadingIcon';

// --- Tiptap UI ---
import {
  canToggle,
  headingIcons,
  isHeadingActive,
  shouldShowButton,
  type Level,
} from '@/features/tiptap/components/ui/HeadingButton';

/**
 * 見出しドロップダウン機能の設定
 */
export interface UseHeadingDropdownMenuConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * ドロップダウンに表示する見出しレベル
   * @default [1, 2, 3, 4, 5, 6]
   */
  levels?: Level[];

  /**
   * 見出しが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

/**
 * 用可能な見出しレベルの中から、現在アクティブな見出しレベルを取得する処理
 * @param editor Tiptapエディターのインスタンス
 * @param levels 見出しレベル一覧
 */
export function getActiveHeadingLevel(
  editor: Editor | null,
  levels: Level[] = [1, 2, 3, 4, 5, 6]
): Level | undefined {
  if (!editor || !editor.isEditable) return undefined;
  return levels.find((level) => isHeadingActive(editor, level));
}

/**
 * Tiptapエディター向けのパラグラフ機能を提供するカスタムフック。
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MyHeadingDropdown() {
 *   const {
 *     isVisible,
 *     activeLevel,
 *     isAnyHeadingActive,
 *     canToggle,
 *     levels,
 *   } = useHeadingDropdownMenu()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <DropdownMenu>
 *       // ドロップダウンコンテンツ
 *     </DropdownMenu>
 *   )
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedHeadingDropdown() {
 *   const {
 *     isVisible,
 *     activeLevel,
 *   } = useHeadingDropdownMenu({
 *     editor: myEditor,
 *     levels: [1, 2, 3],
 *     hideWhenUnavailable: true,
 *   })
 *
 *   // 実際のコンポーネント
 * }
 * ```
 */
export function useHeadingDropdownMenu(config?: UseHeadingDropdownMenuConfig) {
  const {
    editor: providedEditor,
    levels = [1, 2, 3, 4, 5, 6],
    hideWhenUnavailable = false,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState(true);

  const activeLevel = getActiveHeadingLevel(editor, levels);
  const isActive = isHeadingActive(editor);
  const canToggleState = canToggle(editor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowButton({ editor, hideWhenUnavailable, level: levels })
      );
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, levels]);

  return {
    isVisible,
    activeLevel,
    isActive,
    canToggle: canToggleState,
    levels,
    label: 'Heading',
    Icon: activeLevel ? headingIcons[activeLevel] : HeadingIcon,
  };
}

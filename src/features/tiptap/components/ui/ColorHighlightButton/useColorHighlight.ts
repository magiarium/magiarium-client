import { type Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

// --- Hooks ---
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import {
  isExtensionAvailable,
  isMarkInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';

// --- Tiptap Extensions ---
import { getNodeBackgroundAttributeName } from '@/features/tiptap/components/extension/NodeBackground';

// --- Icons ---
import { HighlighterIcon } from '@/features/tiptap/components/icons/HighlighterIcon';

/**　ショートカットキー */
export const COLOR_HIGHLIGHT_SHORTCUT_KEY = 'mod+shift+h';

/** ハイライトカラー一覧 */
export const HIGHLIGHT_COLORS = [
  {
    label: 'Default background',
    value: 'var(--tt-bg-color)',
    colorValue: '#ffffff',
    border: 'var(--tt-bg-color-contrast)',
  },
  {
    label: 'Gray background',
    value: 'var(--tt-color-highlight-gray)',
    colorValue: '#f8f8f7',
    border: 'var(--tt-color-highlight-gray-contrast)',
  },
  {
    label: 'Brown background',
    value: 'var(--tt-color-highlight-brown)',
    colorValue: '#f4eeee',
    border: 'var(--tt-color-highlight-brown-contrast)',
  },
  {
    label: 'Orange background',
    value: 'var(--tt-color-highlight-orange)',
    colorValue: '#fbecdd',
    border: 'var(--tt-color-highlight-orange-contrast)',
  },
  {
    label: 'Yellow background',
    value: 'var(--tt-color-highlight-yellow)',
    colorValue: '#fef9c3',
    border: 'var(--tt-color-highlight-yellow-contrast)',
  },
  {
    label: 'Green background',
    value: 'var(--tt-color-highlight-green)',
    colorValue: '#dcfce7',
    border: 'var(--tt-color-highlight-green-contrast)',
  },
  {
    label: 'Blue background',
    value: 'var(--tt-color-highlight-blue)',
    colorValue: '#e0f2fe',
    border: 'var(--tt-color-highlight-blue-contrast)',
  },
  {
    label: 'Purple background',
    value: 'var(--tt-color-highlight-purple)',
    colorValue: '#f3e8ff',
    border: 'var(--tt-color-highlight-purple-contrast)',
  },
  {
    label: 'Pink background',
    value: 'var(--tt-color-highlight-pink)',
    colorValue: '#fcf1f6',
    border: 'var(--tt-color-highlight-pink-contrast)',
  },
  {
    label: 'Red background',
    value: 'var(--tt-color-highlight-red)',
    colorValue: '#ffe4e6',
    border: 'var(--tt-color-highlight-red-contrast)',
  },
];
/** ハイライトカラー型定義 */
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];

/** ハイライトモード */
export type HighlightMode = 'mark' | 'node';

/**
 * ハイライト機能の設定
 */
export interface UseColorHighlightConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * ハイライトの切り替え時に適用する色。
   */
  highlightColor?: string;

  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  label?: string;

  /**
   * 見出しが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * 使用するハイライト機能
   * - "mark": ハイライトマーク拡張機能を利用する (default)
   * - "node": ノード背景拡張機能を利用する
   * @default "mark"
   */
  mode?: HighlightMode;

  /**
   * true の場合、CSS変数（value）ではなく、実際の色の値（colorValue）を使用する。
   * @default false
   */
  useColorValue?: boolean;

  /**
   * ハイライト適用が正常に完了した後に呼び出されるコールバック関数
   */
  onApplied?: ({
    color,
    label,
    mode,
  }: {
    color: string;
    label: string;
    mode: HighlightMode;
  }) => void;
}

/**
 * 指定された色の値に対応するハイライトカラーを取得する。
 *
 *
 * HIGHLIGHT_COLORS を基に色の値（value）とカラーオブジェクトの
 * マッピングを作成し、指定された値に一致するカラーオブジェクトを返す。
 * 一致するカラーが存在しない場合は除外する。
 *
 * @param values - 取得対象のハイライトカラーの値一覧
 * @returns 指定された値に一致するハイライトカラーの一覧
 */
export function pickHighlightColorsByValue(values: string[]) {
  const colorMap = new Map(
    HIGHLIGHT_COLORS.map((color) => [color.value, color])
  );
  return values
    .map((value) => colorMap.get(value))
    .filter((color): color is (typeof HIGHLIGHT_COLORS)[number] => !!color);
}

/**
 * 設定に応じて適切な払いとカラーの値を取得する
 *
 * @param color ハイライトカラーの値
 * @param useColorValue 実際の色の値を使用するか否か
 * @return 設定に応じたハイライトカラーの値
 */
export function getHighlightColorValue(
  color: string,
  useColorValue: boolean = false
): string {
  if (!useColorValue) return color;

  const colorItem = HIGHLIGHT_COLORS.find(
    (c) => c.value === color || c.colorValue === color
  );
  return colorItem?.colorValue || color;
}

/**
 * 現在のエディター状態で、ハイライトカラー切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param mode ハイライトモード
 * @returns true:利用可、false:利用不可
 */
export function canColorHighlight(
  editor: Editor | null,
  mode: HighlightMode = 'mark'
): boolean {
  if (!editor || !editor.isEditable) return false;

  if (mode === 'mark') {
    if (
      !isMarkInSchema('highlight', editor) ||
      isNodeTypeSelected(editor, ['image'])
    )
      return false;

    return editor.can().setMark('highlight');
  } else {
    if (!isExtensionAvailable(editor, ['nodeBackground'])) return false;

    try {
      return editor.can().toggleNodeBackgroundColor('test');
    } catch {
      return false;
    }
  }
}

/**
 * 対象のカラーハイライトが現在アクティブ状態かどうかチェックする
 *
 * @param editor Tiptapエディターインスタンス
 * @param highlightColor ハイライトカラー
 * @param mode ハイライトモード
 * @returns true:アクティブ状態、false:非アクティブ状態
 */
export function isColorHighlightActive(
  editor: Editor | null,
  highlightColor?: string,
  mode: HighlightMode = 'mark'
): boolean {
  if (!editor || !editor.isEditable) return false;

  if (mode === 'mark') {
    return highlightColor
      ? editor.isActive('highlight', { color: highlightColor })
      : editor.isActive('highlight');
  } else {
    if (!highlightColor) return false;

    try {
      const { state } = editor;
      const { selection } = state;
      const attributeName = getNodeBackgroundAttributeName(editor);

      const $pos = selection.$anchor;
      for (let depth = $pos.depth; depth >= 0; depth--) {
        const node = $pos.node(depth);
        if (node && node.attrs?.[attributeName] === highlightColor) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }
}

/**
 * 指定されたモードに応じてハイライトをremoveする
 *
 * @param editor Tiptapエディター
 * @param mode ハイライトモード
 * @return true: 成功、false: 失敗
 */
export function removeHighlight(
  editor: Editor | null,
  mode: HighlightMode = 'mark'
): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canColorHighlight(editor, mode)) return false;

  if (mode === 'mark') {
    return editor.chain().focus().unsetMark('highlight').run();
  } else {
    return editor.chain().focus().unsetNodeBackgroundColor().run();
  }
}

/**
 * ハイライトボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable ハイライト機能が使用できない場合に、ボタンを非表示にするかどうか。
 * @param props.mode ハイライトモード
 * @returns false:表示する, true:非表示
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
  mode: HighlightMode;
}): boolean {
  const { editor, hideWhenUnavailable, mode } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  // hideWhenUnavailable=true: check schema/extension availability
  if (mode === 'mark') {
    if (!isMarkInSchema('highlight', editor)) return false;
  } else {
    if (!isExtensionAvailable(editor, ['nodeBackground'])) return false;
  }

  if (!editor.isActive('code')) {
    return canColorHighlight(editor, mode);
  }

  return true;
}

/**
 * Tiptapエディター向けのカラーハイライト機能を提供するカスタムフック
 * @param config カラーハイライト設定
 */
export function useColorHighlight(config: UseColorHighlightConfig) {
  const {
    editor: providedEditor,
    label,
    highlightColor,
    hideWhenUnavailable = false,
    mode = 'mark',
    useColorValue = false,
    onApplied,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canColorHighlightState = canColorHighlight(editor, mode);
  const actualColor = highlightColor
    ? getHighlightColorValue(highlightColor, useColorValue)
    : highlightColor;
  const isActive = isColorHighlightActive(editor, actualColor, mode);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable, mode }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, mode]);

  const handleColorHighlight = useCallback(() => {
    if (!editor || !canColorHighlightState || !actualColor || !label)
      return false;

    if (mode === 'mark') {
      if (editor.state.storedMarks) {
        const highlightMarkType = editor.schema.marks.highlight;
        if (highlightMarkType) {
          editor.view.dispatch(
            editor.state.tr.removeStoredMark(highlightMarkType)
          );
        }
      }

      setTimeout(() => {
        const success = editor
          .chain()
          .focus()
          .toggleHighlight({ color: actualColor })
          .run();
        if (success) {
          onApplied?.({ color: actualColor, label, mode });
        }
        return success;
      }, 0);

      return true;
    } else {
      const success = editor
        .chain()
        .focus()
        .toggleNodeBackgroundColor(actualColor)
        .run();

      if (success) {
        onApplied?.({ color: actualColor, label, mode });
      }
      return success;
    }
  }, [canColorHighlightState, actualColor, editor, label, onApplied, mode]);

  const handleRemoveHighlight = useCallback(() => {
    const success = removeHighlight(editor, mode);
    if (success) {
      onApplied?.({ color: '', label: 'Remove highlight', mode });
    }
    return success;
  }, [editor, onApplied, mode]);

  useHotkeys(
    COLOR_HIGHLIGHT_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleColorHighlight();
    },
    {
      enabled: isVisible && canColorHighlightState,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  );

  return {
    isVisible,
    isActive,
    handleColorHighlight,
    handleRemoveHighlight,
    canColorHighlight: canColorHighlightState,
    label: label || `Highlight`,
    shortcutKeys: COLOR_HIGHLIGHT_SHORTCUT_KEY,
    Icon: HighlighterIcon,
    mode,
  };
}

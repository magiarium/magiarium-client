'use client';

import { forwardRef, useCallback, useMemo } from 'react';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Tiptap UI ---
import type { UseColorHighlightConfig } from '@/features/tiptap/components/ui/ColorHighlightButton';
import {
  COLOR_HIGHLIGHT_SHORTCUT_KEY,
  useColorHighlight,
} from '@/features/tiptap/components/ui/ColorHighlightButton';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

// --- Styles ---
import './ColorHighlightButton.scss';

export interface ColorHighlightButtonProps
  extends Omit<ButtonProps, 'type'>, UseColorHighlightConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;

  /**
   * ボタン内にショートカットキーを表示するかどうか(任意)
   * @default false
   */
  showShortcut?: boolean;
}

/**
 * カラーハイライト切り替えショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export function ColorHighlightShortcutBadge({
  shortcutKeys = COLOR_HIGHLIGHT_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Tiptapエディターにカラーハイライトを適用するためのボタンコンポーネント
 *
 * ２つのカラーハイライトモードをサポート
 * - "mark": ハイライトアーク拡張機能を使用して、テキストの一部をインライン要素として装飾します。 (default)
 * - "node": ノード背景拡張機能を使用して、対象ノードを背景を変更します。
 *
 * カスタムボタンを実装する場合は、代わりに `useColorHight` フックを使用してください。
 *
 * @example
 * ```tsx
 * // マークベースハイライト (default)
 * <ColorHighlightButton highlightColor="yellow" />
 *
 * // ノードベースの背景カラー
 * <ColorHighlightButton
 *   highlightColor="var(--tt-color-highlight-blue)"
 *   mode="node"
 * />
 *
 * // カスタムコールバック関数の追加
 * <ColorHighlightButton
 *   highlightColor="red"
 *   mode="mark"
 *   onApplied={({ color, mode }) => console.log(`Applied ${color} in ${mode} mode`)}
 * />
 * ```
 */
export const ColorHighlightButton = forwardRef<
  HTMLButtonElement,
  ColorHighlightButtonProps
>(
  (
    {
      editor: providedEditor,
      highlightColor,
      text,
      hideWhenUnavailable = false,
      mode = 'mark',
      onApplied,
      showShortcut = false,
      onClick,
      children,
      style,
      useColorValue = false,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      canColorHighlight,
      isActive,
      handleColorHighlight,
      label,
      shortcutKeys,
    } = useColorHighlight({
      editor,
      highlightColor,
      useColorValue,
      label: text || `Toggle highlight (${highlightColor})`,
      hideWhenUnavailable,
      mode,
      onApplied,
    });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleColorHighlight();
      },
      [handleColorHighlight, onClick]
    );

    const buttonStyle = useMemo(
      () =>
        ({
          ...style,
          '--highlight-color': highlightColor,
        }) as React.CSSProperties,
      [highlightColor, style]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? 'on' : 'off'}
        role="button"
        tabIndex={-1}
        disabled={!canColorHighlight}
        data-disabled={!canColorHighlight}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        style={buttonStyle}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <span
              className="tiptap-button-highlight"
              style={
                { '--highlight-color': highlightColor } as React.CSSProperties
              }
            />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <ColorHighlightShortcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  }
);

ColorHighlightButton.displayName = 'ColorHighlightButton';

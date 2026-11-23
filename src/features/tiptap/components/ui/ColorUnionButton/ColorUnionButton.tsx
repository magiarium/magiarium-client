import { forwardRef, useCallback, useMemo } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Tiptap UI ---
import { useColorHighlight } from '@/features/tiptap/components/ui/ColorHighlightButton';
import type { UseColorUnionConfig } from '@/features/tiptap/components/ui/ColorUnionButton';
import { useFontColor } from '@/features/tiptap/components/ui/FontColorButton';

// --- UI Primitives --
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

// --- Style
import './ColorUnionButton.scss';

export interface ColorUnionButtonProps
  extends Omit<ButtonProps, 'type'>, UseColorUnionConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;
}

/**
 * HighlightColor+FontColorをまとめて適用するためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useFontColor` と `useColorHighlight` フックを使用してください。
 */
export const ColorUnionButton = forwardRef<
  HTMLButtonElement,
  ColorUnionButtonProps
>(
  (
    {
      editor: providedEditor,
      font,
      highlight,
      text,
      hideWhenUnavailable = false,
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
      isActive: isFontColorActive,
      isVisible: isFontColorVisible,
      canFontColor,
      handleFontColor,
    } = useFontColor({
      editor,
      fontColor: font.color,
      useColorValue,
      label: text || `Toggle FontColor (${font.color})`,
      hideWhenUnavailable,
      onApplied: font.onApplied,
    });

    const {
      isVisible: isColorHighlightVisible,
      canColorHighlight,
      isActive: isColorHighlightActive,
      handleColorHighlight,
    } = useColorHighlight({
      editor,
      highlightColor: highlight.color,
      useColorValue,
      label: text || `Toggle highlight (${highlight.color})`,
      hideWhenUnavailable,
      onApplied: font.onApplied,
    });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleFontColor();
        handleColorHighlight();
      },
      [handleFontColor, handleColorHighlight, onClick]
    );

    const buttonStyle = useMemo(
      () =>
        ({
          ...style,
          '--font-color': font.color,
          '--highlight-color': highlight.color,
        }) as React.CSSProperties,
      [font.color, highlight.color, style]
    );

    if (!isColorHighlightVisible || !isFontColorVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={
          isFontColorActive && isColorHighlightActive ? 'on' : 'off'
        }
        role="button"
        tabIndex={-1}
        disabled={!canFontColor || !canColorHighlight}
        data-disabled={!canFontColor || !canColorHighlight}
        aria-label={`background-color:${highlight.color}, font-color:${font.color}`}
        aria-pressed={isFontColorActive && isColorHighlightActive}
        tooltip={`background-color:${highlight.color}, font-color:${font.color}`}
        onClick={handleClick}
        style={buttonStyle}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <span
              className="tiptap-button-color-union"
              style={
                {
                  '--font-color': font.color,
                  '--highlight-color': highlight.color,
                } as React.CSSProperties
              }
            >
              A
            </span>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    );
  }
);

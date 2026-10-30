import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import { useColorHighlight } from '@/features/tiptap/components/ui/ColorHighlightButton';
import { useFontColor } from '@/features/tiptap/components/ui/FontColorButton';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { forwardRef, useCallback, useMemo } from 'react';
import './ColorButton.scss';
import { UseColorConfig } from './useColorButton';

export interface ColorButtonProps
  extends Omit<ButtonProps, 'type'>, UseColorConfig {
  text?: string;
}

export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
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
              className="tiptap-button-color"
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

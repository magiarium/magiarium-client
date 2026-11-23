import { forwardRef, useMemo } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Tiptap UI ---
import type { UseFontSizeConfig } from '@/features/tiptap/components/ui/FontSizeButton';
import { useFontSize } from '@/features/tiptap/components/ui/FontSizeButton';

// --- UI Primitives ---
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

import './FontSizeButton.scss';

export interface FontSizeButtonProps
  extends Omit<ButtonProps, 'type'>, UseFontSizeConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;
}

/**
 * Tiptapエディター内のフォントサイズを切り替えるためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useFontSize` フックを使用してください。
 */
export const FontSizeButton = forwardRef<
  HTMLButtonElement,
  FontSizeButtonProps
>(
  (
    {
      editor: providedEditor,
      fontSize,
      text,
      hideWhenUnavailable = false,
      onApplied,
      onClick,
      children,
      style,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      isActive,
      handleFontSize,
      handleRemoveFontSize,
      canFontSize,
      label,
    } = useFontSize({
      editor,
      fontSize,
      label: text || `Toggle fontsize (${fontSize})`,
      hideWhenUnavailable,
      onApplied,
    });

    const buttonStyle = useMemo(
      () =>
        ({
          ...style,
          '--font-size': fontSize,
        }) as React.CSSProperties,
      [fontSize, style]
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
        disabled={!canFontSize}
        data-disabled={!canFontSize}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={() => {
          if (isActive) {
            handleRemoveFontSize();
          } else {
            handleFontSize();
          }
        }}
        style={buttonStyle}
        {...buttonProps}
        ref={ref}
      >
        {children ?? <span className="tiptap-button-font-size">{label}</span>}
      </Button>
    );
  }
);

FontSizeButton.displayName = 'FontSizeButton';

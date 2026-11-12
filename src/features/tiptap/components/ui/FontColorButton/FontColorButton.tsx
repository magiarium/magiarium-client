import { forwardRef, useCallback, useMemo } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Tiptap UI ---
import type { UseFontColorConfig } from '@/features/tiptap/components/ui/FontColorButton';
import { useFontColor } from '@/features/tiptap/components/ui/FontColorButton';

// --- UI Primitives ---
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

// --- Styles ---
import './FontColorButton.scss';

export interface FontColorButtonProps
  extends Omit<ButtonProps, 'type'>, UseFontColorConfig {
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
 * Tiptapエディターにフォントカラーを適用するためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useFontColor` フックを使用してください。
 */
export const FontColorButton = forwardRef<
  HTMLButtonElement,
  FontColorButtonProps
>(
  (
    {
      editor: providedEditor,
      fontColor,
      text,
      hideWhenUnavailable = false,
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
    const { isVisible, canFontColor, isActive, handleFontColor, label } =
      useFontColor({
        editor,
        fontColor,
        useColorValue,
        label: text || `Toggle FontColor (${fontColor})`,
        hideWhenUnavailable,
        onApplied,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleFontColor();
      },
      [handleFontColor, onClick]
    );

    const buttonStyle = useMemo(
      () =>
        ({
          ...style,
          '--font-color': fontColor,
        }) as React.CSSProperties,
      [fontColor, style]
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
        disabled={!canFontColor}
        data-disabled={!canFontColor}
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
              className="tiptap-button-fontcolor"
              style={{ '--font-color': fontColor } as React.CSSProperties}
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

FontColorButton.displayName = 'FontColorButton';

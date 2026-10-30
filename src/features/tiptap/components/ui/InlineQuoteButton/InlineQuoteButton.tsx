import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';
import { forwardRef, useCallback } from 'react';
import {
  INLINE_QUOTE_SHORTCUT_KEY,
  useInlineQuote,
  UseInlineQuoteConfig,
} from './useInlineQuote';

export interface InlineQuoteButtonProps
  extends Omit<ButtonProps, 'type'>, UseInlineQuoteConfig {
  text?: string;
  showShortcut?: boolean;
}
export const InlineQuoteShorcutBadge = ({
  shortcutKeys = INLINE_QUOTE_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

export const InlineQuoteButton = forwardRef<
  HTMLButtonElement,
  InlineQuoteButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onToggled,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      handleInlineQuote,
      label,
      canToggle,
      isActive,
      Icon,
      shortcutKeys,
    } = useInlineQuote({
      editor,
      hideWhenUnavailable,
      onToggled,
    });
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleInlineQuote();
      },
      [handleInlineQuote, onClick]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canToggle}
        variant="ghost"
        data-active-state={isActive ? 'on' : 'off'}
        data-disabled={!canToggle}
        role="button"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <InlineQuoteShorcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  }
);

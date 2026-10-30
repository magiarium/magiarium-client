import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';
import { forwardRef, useCallback } from 'react';
import { TIPS_SHORTCUT_KEY, useTips, UseTipsConfig } from './useTips';

export interface TipsButtonProps
  extends Omit<ButtonProps, 'type'>, UseTipsConfig {
  text?: string;
  showShortcut?: boolean;
}

export const TipsShortcutBadge = ({
  shortcutKeys = TIPS_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

export const TipsButton = forwardRef<HTMLButtonElement, TipsButtonProps>(
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
      canToggle,
      isActive,
      handleToggle,
      label,
      shortcutKeys,
      Icon,
    } = useTips({
      editor,
      hideWhenUnavailable,
      onToggled,
    });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleToggle();
      },
      [handleToggle, onClick]
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
        disabled={!canToggle}
        data-disabled={!canToggle}
        aria-label={label}
        aria-pressed={isActive}
        tooltip="Tips"
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && <TipsShortcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  }
);

TipsButton.displayName = 'TipsButton';

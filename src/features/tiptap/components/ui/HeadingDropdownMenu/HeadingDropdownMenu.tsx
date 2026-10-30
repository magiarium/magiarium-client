'use client';

import { forwardRef, useCallback, useState } from 'react';

// --- Icons ---
import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Tiptap UI ---
import { HeadingButton } from '@/features/tiptap/components/ui/HeadingButton';
import type { UseHeadingDropdownMenuConfig } from '@/features/tiptap/components/ui/HeadingDropdownMenu';
import { useHeadingDropdownMenu } from '@/features/tiptap/components/ui/HeadingDropdownMenu';

// --- UI Primitives ---
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/components/ui-primitive/DropdownMenu';

export interface HeadingDropdownMenuProps
  extends Omit<ButtonProps, 'type'>, UseHeadingDropdownMenuConfig {
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether the dropdown should use a modal
   */
  modal?: boolean;
}

/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export const HeadingDropdownMenu = forwardRef<
  HTMLButtonElement,
  HeadingDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      levels = [1, 2, 3, 4, 5, 6],
      hideWhenUnavailable = false,
      onOpenChange,
      children,
      modal = true,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
      editor,
      levels,
      hideWhenUnavailable,
    });

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!editor || !canToggle) return;
        setIsOpen(open);
        onOpenChange?.(open);
      },
      [canToggle, editor, onOpenChange]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            data-active-state={isActive ? 'on' : 'off'}
            role="button"
            tabIndex={-1}
            disabled={!canToggle}
            data-disabled={!canToggle}
            aria-label="Format text as heading"
            aria-pressed={isActive}
            tooltip="Heading"
            {...buttonProps}
            ref={ref}
          >
            {children ? (
              children
            ) : (
              <>
                <Icon className="tiptap-button-icon" />
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side={'right'} align="start" sideOffset={50}>
          <DropdownMenuGroup>
            {levels.map((level) => (
              <DropdownMenuItem key={`heading-${level}`} asChild>
                <HeadingButton
                  editor={editor}
                  level={level}
                  text={`Heading ${level}`}
                  showTooltip={false}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

HeadingDropdownMenu.displayName = 'HeadingDropdownMenu';

export default HeadingDropdownMenu;

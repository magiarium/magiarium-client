import { forwardRef, useCallback, useState, type ForwardedRef } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';

// --- Tiptap UI ---
import { ListButton } from '@/features/tiptap/components/ui/ListButton';

import type { UseListDropdownMenuConfig } from './useListDropdownMenu';
import { useListDropdownMenu } from './useListDropdownMenu';

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

export interface ListDropdownMenuProps
  extends Omit<ButtonProps, 'type'>, UseListDropdownMenuConfig {
  /**
   * ドロップダウンメニュー開閉時のコールバック関数
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * ドロップダウンにモーダルを使用するかどうか
   * @default false
   */
  modal?: boolean;

  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;
}

/**
 * リストのドロップダウンメニュー
 * @param param0
 * @param ref
 * @returns
 */
export const ListDropdownMenu = forwardRef<
  HTMLButtonElement,
  ListDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      text,
      types = ['bulletList', 'orderedList', 'taskList'],
      hideWhenUnavailable = false,
      onOpenChange,
      modal = true,
      children,
      ...props
    }: ListDropdownMenuProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);

    const { filteredLists, canToggle, isActive, isVisible, Icon } =
      useListDropdownMenu({
        editor,
        types,
        hideWhenUnavailable,
      });

    const handleOnOpenChange = useCallback(
      (open: boolean) => {
        setIsOpen(open);
        onOpenChange?.(open);
      },
      [onOpenChange]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <DropdownMenu
        modal={modal}
        open={isOpen}
        onOpenChange={handleOnOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            data-active-state={isActive ? 'on' : 'off'}
            role="button"
            tabIndex={-1}
            disabled={!canToggle}
            data-disabled={!canToggle}
            aria-label="List options"
            tooltip="List"
            {...props}
            ref={ref}
          >
            {children ?? (
              <>
                <Icon className="tiptap-button-icon" />
                {text && <span className="tiptap-button-text">{text}</span>}
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side={'right'} align="start">
          <DropdownMenuGroup>
            {filteredLists.map((option) => (
              <DropdownMenuItem key={option.type} asChild>
                <ListButton
                  editor={editor}
                  type={option.type}
                  text={option.label}
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

ListDropdownMenu.displayName = 'ListDropdownMenu';

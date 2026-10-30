import { type Editor } from '@tiptap/react';
import { forwardRef, useCallback, useState, type ForwardedRef } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';

// --- Tiptap UI ---
import {
  ListButton,
  type ListType,
} from '@/features/tiptap/components/ui/ListButton';

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

export interface ListDropdownMenuProps extends Omit<ButtonProps, 'type'> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor;
  /**
   * The list types to display in the dropdown.
   */
  types?: ListType[];
  /**
   * Whether the dropdown should be hidden when no list types are available
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether the dropdown should use a modal
   */
  modal?: boolean;
}

function ListDropdownMenuImpl(
  {
    editor: providedEditor,
    types = ['bulletList', 'orderedList', 'taskList'],
    hideWhenUnavailable = false,
    onOpenChange,
    modal = true,
    children,
    ...props
  }: ListDropdownMenuProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
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
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOnOpenChange}>
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

export const ListDropdownMenu = forwardRef(ListDropdownMenuImpl);

ListDropdownMenu.displayName = 'ListDropdownMenu';

export default ListDropdownMenu;

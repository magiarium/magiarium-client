import { useCurrentNode } from '@/features/tiptap/hooks/useCurrentNode';
import { Editor } from '@tiptap/react';
import { forwardRef, useState } from 'react';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { Button, ButtonProps } from '../../ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui-primitive/DropdownMenu';

type SelectorItems = {
  key: string;
  label: string;
  renderIcon: ({ className }: { className: string }) => JSX.Element;
  renderItem?: (
    editor: Editor,
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  ) => JSX.Element;
  asChild?: boolean;
};

export const NodeDropdownMenu = ({
  editor,
  selectorItems,
}: {
  editor: Editor;
  selectorItems: SelectorItems[];
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const currentNode = useCurrentNode(editor);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton editor={editor} selectorItems={selectorItems} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        style={{ overflow: 'visible' }}
        className="magiarium-editor__dropdown-menu"
        onInteractOutside={(event) => {
          if (popoverOpen) {
            event.preventDefault();
          }
        }}
      >
        {selectorItems.map((item) => {
          if (typeof item.renderItem !== 'function') {
            return null;
          }
          return (
            <DropdownMenuItem
              key={item.key}
              asChild={item.asChild}
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              {item.renderItem(editor, setPopoverOpen)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface TriggerButtonButtonProps extends Omit<ButtonProps, 'type'> {
  editor: Editor;
  selectorItems: SelectorItems[];
}

const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonButtonProps>(
  ({ editor, selectorItems, ...props }, ref) => {
    const currentNode = useCurrentNode(editor);

    const selector =
      selectorItems.find((value) => value.key === currentNode) ??
      selectorItems[0];

    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={
          currentNode === selector.key && currentNode !== 'undefined'
            ? 'on'
            : 'off'
        }
        role="button"
        tabIndex={-1}
        aria-label="node-selector"
        tooltip="ノードセレクター"
        {...props}
        ref={ref}
      >
        {selector.renderIcon({ className: 'tiptap-button-icon' })}
        {selector.label}
        <ChevronDownIcon className="tiptap-button-dropdown-small" />
      </Button>
    );
  }
);

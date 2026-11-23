import { useCurrentNode } from '@/features/tiptap/hooks/useCurrentNode';
import { Editor } from '@tiptap/react';
import { forwardRef } from 'react';
import { IconType } from 'react-icons/lib';
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
  Icon: IconType;
  renderItem?: (editor: Editor) => JSX.Element;
  asChild?: boolean;
};

export const NodeDropdownMenu = ({
  editor,
  selectorItems,
}: {
  editor: Editor;
  selectorItems: SelectorItems[];
}) => {
  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <TriggerButton editor={editor} selectorItems={selectorItems} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        style={{ overflow: 'visible' }}
        className="magiarium-editor__dropdown-menu"
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
              {item.renderItem(editor)}
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
        aria-label="node-selector"
        tooltip="ノードセレクター"
        {...props}
        ref={ref}
      >
        <selector.Icon className="tiptap-button-icon" />
        {selector.label}
        <ChevronDownIcon className="tiptap-button-dropdown-small" />
      </Button>
    );
  }
);

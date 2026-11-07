import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/components/ui-primitive/DropdownMenu';
import {
  getActiveTextAlignInfo,
  TextAlign,
  TextAlignButton,
  textAlignIcons,
  textAlignLabels,
} from '@/features/tiptap/components/ui/TextAlignButton';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { Editor } from '@tiptap/react';
import { useState } from 'react';

/**
 * TextAlignドロップダウンメニュー
 */
export const TextAlignDropdownMenu = ({
  editor: providedEditor,
}: {
  editor?: Editor | null;
}) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);
  const acitveTextAlignInfo = getActiveTextAlignInfo(editor);
  const Icon = textAlignIcons[acitveTextAlignInfo.activeTextAlign || 'left'];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-active-state={acitveTextAlignInfo.isActive ? 'on' : 'off'}
          aria-pressed={acitveTextAlignInfo.isActive}
          variant="ghost"
          role="button"
          tabIndex={-1}
          tooltip="Align"
        >
          <Icon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        {(Object.entries(textAlignLabels) as [TextAlign, string][]).map(
          ([key, value]) => {
            return (
              <DropdownMenuItem key={`text-aling-dropdown-item-${key}`} asChild>
                <TextAlignButton editor={editor} align={key} text={value} />
              </DropdownMenuItem>
            );
          }
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

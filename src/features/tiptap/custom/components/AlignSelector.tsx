import { Editor } from '@tiptap/core';
import { AlignCenterIcon } from '../../basic/components/icons/align-center-icon';
import { AlignJustifyIcon } from '../../basic/components/icons/align-justify-icon';
import { AlignLeftIcon } from '../../basic/components/icons/align-left-icon';
import { AlignRightIcon } from '../../basic/components/icons/align-right-icon';
import { ChevronDownIcon } from '../../basic/components/icons/chevron-down-icon';
import { Button } from '../../basic/components/ui-primitive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../basic/components/ui-primitive/dropdown-menu';
import { TextAlignButton } from '../../basic/components/ui/text-align-button';

export const AlignSelector = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <AlignLeftIcon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        <DropdownMenuItem asChild>
          <TextAlignButton editor={editor} align="left">
            <AlignLeftIcon className="tiptap-button-icon" />
            左寄せ
          </TextAlignButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <TextAlignButton editor={editor} align="center">
            <AlignCenterIcon className="tiptap-button-icon" />
            中央寄せ
          </TextAlignButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <TextAlignButton editor={editor} align="right">
            <AlignRightIcon className="tiptap-button-icon" />
            右寄せ
          </TextAlignButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <TextAlignButton editor={editor} align="justify">
            <AlignJustifyIcon className="tiptap-button-icon" />
            整列
          </TextAlignButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

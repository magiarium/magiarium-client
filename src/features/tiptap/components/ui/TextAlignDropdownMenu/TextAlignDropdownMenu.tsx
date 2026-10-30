import { AlignCenterIcon } from '@/features/tiptap/components/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/features/tiptap/components/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/features/tiptap/components/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/features/tiptap/components/icons/AlignRightIcon';
import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/components/ui-primitive/DropdownMenu';
import { TextAlignButton } from '@/features/tiptap/components/ui/TextAlignButton';
import { Editor } from '@tiptap/react';

export const TextAlignDropdownMenu = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="button"
          tabIndex={-1}
          tooltip="Align"
        >
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

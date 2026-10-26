import { AlignCenterIcon } from '@/features/tiptap/basic/components/icons/align-center-icon';
import { AlignJustifyIcon } from '@/features/tiptap/basic/components/icons/align-justify-icon';
import { AlignLeftIcon } from '@/features/tiptap/basic/components/icons/align-left-icon';
import { AlignRightIcon } from '@/features/tiptap/basic/components/icons/align-right-icon';
import { ChevronDownIcon } from '@/features/tiptap/basic/components/icons/chevron-down-icon';
import { Button } from '@/features/tiptap/basic/components/ui-primitive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/basic/components/ui-primitive/dropdown-menu';
import { ColorHighlightPopover } from '@/features/tiptap/basic/components/ui/color-highlight-popover';
import { LinkPopover } from '@/features/tiptap/basic/components/ui/link-popover';
import { MarkButton } from '@/features/tiptap/basic/components/ui/mark-button';
import { TextAlignButton } from '@/features/tiptap/basic/components/ui/text-align-button';
import { Editor } from '@tiptap/react';
import { BsQuote, BsType } from 'react-icons/bs';
import './MarkSelector.scss';

export const textAlignIcons = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};

export const MarkSelector = ({ editor }: { editor: Editor }) => {
  return (
    <div className="magiarium-editor__mark-selector">
      <MarkButton editor={editor} type="bold" />
      <MarkButton editor={editor} type="italic" />
      <MarkButton editor={editor} type="strike" />
      <MarkButton editor={editor} type="underline" />
      <MarkButton editor={editor} type="code" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <BsType />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom">
          <DropdownMenuItem asChild>
            <Button
              onClick={() => {
                editor.chain().focus().setFontSize('1rem').run();
              }}
              style={{ fontSize: '1rem' }}
            >
              標準
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              onClick={() => {
                editor.chain().focus().setFontSize('1.25rem').run();
              }}
              style={{ fontSize: '1.5rem' }}
            >
              大きめ
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              onClick={() => {
                editor.chain().focus().setFontSize('0.75rem').run();
              }}
              style={{ fontSize: '0.75rem' }}
            >
              小さめ
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button>
        <BsQuote className="tiptap-button-icon" />
      </Button>
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
      <ColorHighlightPopover editor={editor} />
      <LinkPopover editor={editor} />
      <Button>ﾙﾋﾞ</Button>
    </div>
  );
};

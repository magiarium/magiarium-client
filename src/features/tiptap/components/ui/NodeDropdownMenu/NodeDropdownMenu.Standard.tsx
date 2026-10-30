import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import { HeadingIcon } from '@/features/tiptap/components/icons/HeadingIcon';
import { ListIcon } from '@/features/tiptap/components/icons/ListIcon';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/components/ui-primitive/DropdownMenu';
import { BlockquoteButton } from '@/features/tiptap/components/ui/BlockquoteButton';
import { CodeBlockButton } from '@/features/tiptap/components/ui/CodeBlockButton';
import { HeadingDropdownMenu } from '@/features/tiptap/components/ui/HeadingDropdownMenu';
import { ListDropdownMenu } from '@/features/tiptap/components/ui/ListDropdownMenu';
import { ParagraphButton } from '@/features/tiptap/components/ui/ParagrahButton';
import { Editor } from '@tiptap/react';
import { BsCodeSquare } from 'react-icons/bs';

export const NodeDropdownMenuStandard = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="button"
          tabIndex={-1}
          aria-label="standard-block"
          tooltip="基本要素"
        >
          <BsCodeSquare className="tiptap-button-icon" />
          基本要素
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        style={{
          overflow: 'visible',
        }}
        className="magiarium-editor__dropdown-menu"
      >
        <DropdownMenuItem asChild>
          <ParagraphButton editor={editor} text={'段落'} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HeadingDropdownMenu editor={editor} levels={[3, 4, 5]}>
            <HeadingIcon className="tiptap-button-icon" />
            見出し
            <ChevronDownIcon className="tiptap-button-dropdown-small" />
          </HeadingDropdownMenu>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <CodeBlockButton editor={editor} text={'コードブロック'} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <BlockquoteButton
            editor={editor}
            text="引用ブロック"
          ></BlockquoteButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ListDropdownMenu
            editor={editor}
            types={['bulletList', 'orderedList']}
          >
            <ListIcon className="tiptap-button-icon" />
            リスト
            <ChevronDownIcon className="tiptap-button-dropdown-small" />
          </ListDropdownMenu>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

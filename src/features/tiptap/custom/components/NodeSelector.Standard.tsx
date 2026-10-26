import { BlockquoteIcon } from '@/features/tiptap/basic/components/icons/blockquote-icon';
import { ChevronDownIcon } from '@/features/tiptap/basic/components/icons/chevron-down-icon';
import { CodeBlockIcon } from '@/features/tiptap/basic/components/icons/code-block-icon';
import { HeadingIcon } from '@/features/tiptap/basic/components/icons/heading-icon';
import { ListIcon } from '@/features/tiptap/basic/components/icons/list-icon';
import { Button } from '@/features/tiptap/basic/components/ui-primitive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/basic/components/ui-primitive/dropdown-menu';
import { BlockquoteButton } from '@/features/tiptap/basic/components/ui/blockquote-button';
import { CodeBlockButton } from '@/features/tiptap/basic/components/ui/code-block-button';
import { HeadingDropdownMenu } from '@/features/tiptap/basic/components/ui/heading-dropdown-menu';
import { ListDropdownMenu } from '@/features/tiptap/basic/components/ui/list-dropdown-menu';
import { Editor } from '@tiptap/react';
import { BsCodeSquare, BsParagraph } from 'react-icons/bs';

export const NodeSelectorStandard = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>
          <BsCodeSquare className="tiptap-button-icon" />
          基本要素
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
          <Button
            onClick={() => {
              editor.chain().focus().setParagraph().run();
            }}
          >
            <BsParagraph className="tiptap-button-icon" />
            段落
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HeadingDropdownMenu editor={editor} levels={[3, 4, 5]}>
            <HeadingIcon className="tiptap-button-icon" />
            見出し
            <ChevronDownIcon className="tiptap-button-dropdown-small" />
          </HeadingDropdownMenu>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <CodeBlockButton editor={editor}>
            <CodeBlockIcon className="tiptap-button-icon" />
            コードブロック
          </CodeBlockButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <BlockquoteButton editor={editor}>
            <BlockquoteIcon className="tiptap-button-icon" />
            引用ブロック
          </BlockquoteButton>
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

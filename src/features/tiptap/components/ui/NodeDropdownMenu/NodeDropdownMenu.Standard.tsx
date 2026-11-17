import { HeadingIcon } from '@/features/tiptap/components/icons/HeadingIcon';
import { ListIcon } from '@/features/tiptap/components/icons/ListIcon';
import { BlockquoteButton } from '@/features/tiptap/components/ui/BlockquoteButton';
import { CodeBlockButton } from '@/features/tiptap/components/ui/CodeBlockButton';
import { HeadingDropdownMenu } from '@/features/tiptap/components/ui/HeadingDropdownMenu';
import { ListDropdownMenu } from '@/features/tiptap/components/ui/ListDropdownMenu';
import { ParagraphButton } from '@/features/tiptap/components/ui/ParagrahButton';
import { Editor } from '@tiptap/react';
import { BsCodeSquare, BsParagraph } from 'react-icons/bs';
import { BlockquoteIcon } from '../../icons/BlockquoteIcon';
import { CodeBlockIcon } from '../../icons/CodeBlockIcon';
import { NodeDropdownMenu } from './NodeDropdownMenu';

const STANDARD_NODE_SELECTOR_ITEMS = [
  {
    key: 'undefined',
    label: '基本要素',
    renderIcon: ({ className }: { className: string }) => {
      return <BsCodeSquare className={className} />;
    },
  },
  {
    key: 'paragraph',
    label: '段落',
    renderIcon: ({ className }: { className: string }) => {
      return <BsParagraph className={className} />;
    },
    renderItem: (editor: Editor) => (
      <ParagraphButton editor={editor} text="段落" />
    ),
    asChild: true,
  },
  {
    key: 'heading',
    label: '見出し',
    renderIcon: ({ className }: { className: string }) => {
      return <HeadingIcon className={className} />;
    },
    renderItem: (
      editor: Editor,
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    ) => (
      <HeadingDropdownMenu
        editor={editor}
        levels={[3, 4, 5]}
        text="見出し"
        onOpenChange={(isOpen) => {
          if (setIsOpen) {
            setIsOpen(isOpen);
          }
        }}
      />
    ),
    asChild: false,
  },
  {
    key: 'codeBlock',
    label: 'コードブロック',
    renderIcon: ({ className }: { className: string }) => {
      return <CodeBlockIcon className={className} />;
    },
    renderItem: (editor: Editor) => (
      <CodeBlockButton editor={editor} text="コードブロック" />
    ),
    asChild: true,
  },
  {
    key: 'blockquote',
    label: '引用ブロック',
    renderIcon: ({ className }: { className: string }) => {
      return <BlockquoteIcon className={className} />;
    },
    renderItem: (editor: Editor) => (
      <BlockquoteButton editor={editor} text="引用ブロック" />
    ),
    asChild: true,
  },
  {
    key: 'list',
    label: 'リスト',
    renderIcon: ({ className }: { className: string }) => {
      return <ListIcon className={className} />;
    },
    renderItem: (
      editor: Editor,
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    ) => (
      <ListDropdownMenu
        editor={editor}
        types={['bulletList', 'orderedList']}
        text="リスト"
        onOpenChange={(isOpen) => {
          if (setIsOpen) {
            setIsOpen(isOpen);
          }
        }}
      />
    ),
    asChild: true,
  },
];

export const NodeDropdownMenuStandard = ({ editor }: { editor: Editor }) => {
  return (
    <NodeDropdownMenu
      editor={editor}
      selectorItems={STANDARD_NODE_SELECTOR_ITEMS}
    />
  );
};

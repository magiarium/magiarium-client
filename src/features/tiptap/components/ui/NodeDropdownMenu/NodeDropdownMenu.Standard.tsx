import { HeadingIcon } from '@/features/tiptap/components/icons/HeadingIcon';
import { BlockquoteButton } from '@/features/tiptap/components/ui/BlockquoteButton';
import { CodeBlockButton } from '@/features/tiptap/components/ui/CodeBlockButton';
import { HeadingDropdownMenu } from '@/features/tiptap/components/ui/HeadingDropdownMenu';
import { ListDropdownMenu } from '@/features/tiptap/components/ui/ListDropdownMenu';
import { ParagraphButton } from '@/features/tiptap/components/ui/ParagrahButton';
import { Editor } from '@tiptap/react';
import {
  BsCodeSquare,
  BsInfoCircleFill,
  BsListUl,
  BsParagraph,
} from 'react-icons/bs';
import { BlockquoteIcon } from '../../icons/BlockquoteIcon';
import { CodeBlockIcon } from '../../icons/CodeBlockIcon';
import { TipsButton } from '../TipsButton';
import { NodeDropdownMenu } from './NodeDropdownMenu';

const STANDARD_NODE_SELECTOR_ITEMS = [
  {
    key: 'undefined',
    label: '基本要素',
    Icon: BsCodeSquare,
  },
  {
    key: 'paragraph',
    label: '段落',
    Icon: BsParagraph,
    renderItem: (editor: Editor) => (
      <ParagraphButton editor={editor} text="段落" />
    ),
    asChild: true,
  },
  {
    key: 'heading',
    label: '見出し',
    Icon: HeadingIcon,
    renderItem: (editor: Editor) => (
      <HeadingDropdownMenu editor={editor} levels={[3, 4, 5]} text="見出し" />
    ),
    asChild: false,
  },
  {
    key: 'codeBlock',
    label: 'コードブロック',
    Icon: CodeBlockIcon,
    renderItem: (editor: Editor) => (
      <CodeBlockButton editor={editor} text="コードブロック" />
    ),
    asChild: true,
  },
  {
    key: 'blockquote',
    label: '引用ブロック',
    Icon: BlockquoteIcon,
    renderItem: (editor: Editor) => (
      <BlockquoteButton editor={editor} text="引用ブロック" />
    ),
    asChild: true,
  },
  {
    key: 'list',
    label: 'リスト',
    Icon: BsListUl,
    renderItem: (editor: Editor) => (
      <ListDropdownMenu
        editor={editor}
        types={['bulletList', 'orderedList']}
        text="リスト"
      />
    ),
    asChild: true,
  },
  {
    key: 'tips',
    label: 'Tips',
    Icon: BsInfoCircleFill,
    renderItem: (editor: Editor) => <TipsButton editor={editor} text="Tips" />,
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

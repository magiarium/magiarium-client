import { CharacterSpeechButton } from '@/features/tiptap/components/ui/CharacterSpeechButton';
import { ImageUploadButton } from '@/features/tiptap/components/ui/ImageUploadButton';
import { Editor } from '@tiptap/react';
import {
  BsCardText,
  BsChatFill,
  BsPuzzleFill,
  BsTable,
  BsYoutube,
} from 'react-icons/bs';
import { ImagePlusIcon } from '../../icons/ImagePlusIcon';
import { LinkCardButton } from '../LinkCardButton';
import { TablePopover } from '../TablePopover';
import { YoutubePopover } from '../YoutubePopover';
import { NodeDropdownMenu } from './NodeDropdownMenu';

const CUSTOM_NODE_SELECTOR_ITEMS = [
  {
    key: 'undefined',
    label: 'カスタム要素',
    Icon: BsPuzzleFill,
  },
  {
    key: 'characterSpeech',
    label: 'キャラクタースピーチ',
    Icon: BsChatFill,
    renderItem: (editor: Editor) => (
      <CharacterSpeechButton editor={editor} text="キャラクタースピーチ" />
    ),
    asChild: true,
  },
  {
    key: 'linkCard',
    label: 'リンクカード',
    Icon: BsCardText,
    renderItem: (editor: Editor) => (
      <LinkCardButton editor={editor} text="リンクカード" />
    ),
    asChild: true,
  },
  {
    key: 'image',
    label: '画像',
    Icon: ImagePlusIcon,
    renderItem: (editor: Editor) => (
      <ImageUploadButton editor={editor} text="画像" />
    ),
    asChild: true,
  },
  {
    key: 'table',
    label: 'テーブル',
    Icon: BsTable,
    renderItem: (editor: Editor) => (
      <TablePopover
        editor={editor}
        insertText="テーブル追加"
        deleteText="テーブル削除"
      />
    ),
    asChild: true,
  },
  {
    key: 'youtube',
    label: 'Youtube',
    Icon: BsYoutube,
    renderItem: (editor: Editor) => (
      <YoutubePopover editor={editor} text="Youtube" modal={true} />
    ),
    asChild: true,
  },
];

export const NodeDropdownMenuCustom = ({ editor }: { editor: Editor }) => {
  return (
    <NodeDropdownMenu
      editor={editor}
      selectorItems={CUSTOM_NODE_SELECTOR_ITEMS}
    />
  );
};

import { CharacterSpeechPopover } from '@/features/tiptap/components/ui/CharacterSpeechPopover';
import { ImageUploadButton } from '@/features/tiptap/components/ui/ImageUploadButton';
import { Editor } from '@tiptap/react';
import {
  BsCardText,
  BsChatFill,
  BsInfoCircleFill,
  BsPuzzleFill,
  BsTable,
  BsYoutube,
} from 'react-icons/bs';
import { ImagePlusIcon } from '../../icons/ImagePlusIcon';
import { LinkCardButton } from '../LinkCardButton';
import { TablePopover } from '../TablePopover';
import { TipsButton } from '../TipsButton/TipsButton';
import { YoutubePopover } from '../YoutubePopover';
import { NodeDropdownMenu } from './NodeDropdownMenu';

const CUSTOM_NODE_SELECTOR_ITEMS = [
  {
    key: 'undefined',
    label: 'カスタム要素',
    renderIcon: ({ className }: { className: string }) => {
      return <BsPuzzleFill className={className} />;
    },
  },
  {
    key: 'characterSpeech',
    label: 'キャラクタースピーチ',
    renderIcon: ({ className }: { className: string }) => {
      return <BsChatFill className={className} />;
    },
    renderItem: (
      editor: Editor,
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    ) => (
      <CharacterSpeechPopover
        editor={editor}
        text="キャラクタースピーチ"
        onOpenChange={(isOpen) => {
          if (setIsOpen) {
            setIsOpen(isOpen);
          }
        }}
      />
    ),
    asChild: true,
  },
  {
    key: 'tips',
    label: 'Tips',
    renderIcon: ({ className }: { className: string }) => {
      return <BsInfoCircleFill className={className} />;
    },
    renderItem: (editor: Editor) => <TipsButton editor={editor} text="Tips" />,
    asChild: true,
  },
  {
    key: 'linkCard',
    label: 'リンクカード',
    renderIcon: ({ className }: { className: string }) => {
      return <BsCardText className={className} />;
    },
    renderItem: (editor: Editor) => (
      <LinkCardButton editor={editor} text="リンクカード" />
    ),
    asChild: true,
  },
  {
    key: 'image',
    label: '画像',
    renderIcon: ({ className }: { className: string }) => {
      return <ImagePlusIcon className={className} />;
    },
    renderItem: (editor: Editor) => (
      <ImageUploadButton editor={editor} text="画像" />
    ),
    asChild: true,
  },
  {
    key: 'table',
    label: 'テーブル',
    renderIcon: ({ className }: { className: string }) => {
      return <BsTable className={className} />;
    },
    renderItem: (
      editor: Editor,
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    ) => (
      <TablePopover
        editor={editor}
        text="テーブル"
        onOpenChange={(isOpen) => {
          if (setIsOpen) {
            setIsOpen(isOpen);
          }
        }}
      />
    ),
    asChild: true,
  },
  {
    key: 'youtube',
    label: 'Youtube',
    renderIcon: ({ className }: { className: string }) => {
      return <BsYoutube className={className} />;
    },
    renderItem: (
      editor: Editor,
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    ) => (
      <YoutubePopover
        editor={editor}
        text="Youtube"
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

export const NodeDropdownMenuCustom = ({ editor }: { editor: Editor }) => {
  return (
    <NodeDropdownMenu
      editor={editor}
      selectorItems={CUSTOM_NODE_SELECTOR_ITEMS}
    />
  );
};

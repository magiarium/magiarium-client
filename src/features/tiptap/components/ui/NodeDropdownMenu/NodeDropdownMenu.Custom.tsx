import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/components/ui-primitive/DropdownMenu';
import { CharacterSpeechPopover } from '@/features/tiptap/components/ui/CharacterSpeechPopover';
import { ImageUploadButton } from '@/features/tiptap/components/ui/ImageUploadButton';
import { Editor } from '@tiptap/react';
import { BsPuzzleFill } from 'react-icons/bs';
import { LinkCardPopover } from '../LinkCardButton/LinkCardButton';
import { TablePopover } from '../TablePopover';
import { TipsButton } from '../TipsButton/TipsButton';
import { YoutubePopover } from '../YoutubePopover';

export const NodeDropdownMenuCustom = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="button"
          tabIndex={-1}
          aria-label="standard-block"
          tooltip="カスタム要素"
        >
          <BsPuzzleFill className="tiptap-button-icon" />
          カスタム要素
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="magiarium-editor__dropdown-menu"
      >
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <CharacterSpeechPopover editor={editor} text="キャラクタースピーチ" />
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <TipsButton editor={editor} text="Tips" />
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <LinkCardPopover editor={editor} text="リンクカード" />
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <ImageUploadButton editor={editor} text="画像" />
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <TablePopover editor={editor} text="テーブル" />
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <YoutubePopover editor={editor} text="Youtube" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

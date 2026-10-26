import { Button } from '@/features/tiptap/basic/components/ui-primitive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/basic/components/ui-primitive/dropdown-menu';
import { ImageUploadButton } from '@/features/tiptap/basic/components/ui/image-upload-button';
import { Editor } from '@tiptap/react';
import {
  BsCardText,
  BsChatFill,
  BsImage,
  BsInfoCircleFill,
  BsPuzzleFill,
  BsTable,
  BsYoutube,
} from 'react-icons/bs';

export const NodeSelectorCustom = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>
          <BsPuzzleFill className="tiptap-button-icon" />
          カスタム要素
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="magiarium-editor__dropdown-menu"
      >
        <DropdownMenuItem asChild>
          <Button>
            <BsChatFill className="tiptap-button-icon" />
            キャラクタースピーチ
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button>
            <BsInfoCircleFill className="tiptap-button-icon" />
            Tips
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button>
            <BsCardText className="tiptap-button-icon" />
            ブロックリンク
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ImageUploadButton editor={editor}>
            <BsImage className="tiptap-button-icon" />
            画像
          </ImageUploadButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button>
            <BsTable className="tiptap-button-icon" />
            テーブル
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button>
            <BsYoutube className="tiptap-button-icon" />
            Youtube
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

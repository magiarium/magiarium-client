import { Button } from '@/features/tiptap/basic/components/ui-primitive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/basic/components/ui-primitive/dropdown-menu';
import { Editor } from '@tiptap/core';
import { BsType } from 'react-icons/bs';

export const TextSizeSelector = ({ editor }: { editor: Editor }) => {
  return (
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
  );
};

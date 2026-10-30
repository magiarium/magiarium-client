import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/components/ui-primitive/DropdownMenu';
import { Editor, useEditorState } from '@tiptap/react';
import { FiType } from 'react-icons/fi';
import './FontSizeDropdownMenu.scss';

const FONT_SIZE = {
  MEDIUM: '1rem',
  LARGE: '1.25rem',
  SMALL: '0.75rem',
};

export const FontSizeDropdownMenu = ({ editor }: { editor: Editor }) => {
  const currentFontSize = useEditorState({
    editor,
    selector: ({ editor }) => {
      return editor.getAttributes('textStyle').fontSize ?? FONT_SIZE.MEDIUM;
    },
  });
  const sizeLabel =
    currentFontSize === FONT_SIZE.SMALL
      ? 's'
      : currentFontSize === FONT_SIZE.LARGE
        ? 'l'
        : 'm';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="button"
          tabIndex={-1}
          tooltip="FontSize"
        >
          <div className="font-size__icon">
            <FiType />
            <span className="font-size__label">{sizeLabel}</span>
          </div>
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        <DropdownMenuItem asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            aria-label="フォントサイズ(ラージ)"
            tooltip="FontSize Large"
            data-active-state={sizeLabel === 'l' ? 'on' : 'off'}
            onClick={() => {
              editor.chain().focus().setFontSize(FONT_SIZE.LARGE).run();
            }}
            style={{ fontSize: FONT_SIZE.LARGE }}
          >
            大きめ
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            aria-label="フォントサイズ(ミディアム)"
            tooltip="FontSize Medium"
            data-active-state={sizeLabel === 'm' ? 'on' : 'off'}
            onClick={() => {
              editor.chain().focus().setFontSize(FONT_SIZE.MEDIUM).run();
            }}
            style={{ fontSize: FONT_SIZE.MEDIUM }}
          >
            標準
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            aria-label="フォントサイズ(スモール)"
            tooltip="FontSize Large"
            data-active-state={sizeLabel === 's' ? 'on' : 'off'}
            onClick={() => {
              editor.chain().focus().setFontSize(FONT_SIZE.SMALL).run();
            }}
            style={{ fontSize: FONT_SIZE.SMALL }}
          >
            小さめ
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { AlignCenterIcon } from '@/features/tiptap/basic/components/icons/align-center-icon';
import { AlignJustifyIcon } from '@/features/tiptap/basic/components/icons/align-justify-icon';
import { AlignLeftIcon } from '@/features/tiptap/basic/components/icons/align-left-icon';
import { AlignRightIcon } from '@/features/tiptap/basic/components/icons/align-right-icon';
import { Button } from '@/features/tiptap/basic/components/ui-primitive/button';
import { ColorHighlightPopover } from '@/features/tiptap/basic/components/ui/color-highlight-popover';
import { LinkPopover } from '@/features/tiptap/basic/components/ui/link-popover';
import { MarkButton } from '@/features/tiptap/basic/components/ui/mark-button';
import { Editor } from '@tiptap/react';
import { BsQuote } from 'react-icons/bs';
import { AlignSelector } from './AlignSelector';
import './MarkToolbar.scss';
import { TextSizeSelector } from './TextSizeSelector';

export const textAlignIcons = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};

export const MarkToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="magiarium-editor__mark-toolbar">
      <MarkButton editor={editor} type="bold" />
      <MarkButton editor={editor} type="italic" />
      <MarkButton editor={editor} type="strike" />
      <MarkButton editor={editor} type="underline" />
      <MarkButton editor={editor} type="code" />
      <TextSizeSelector editor={editor} />
      <Button>
        <BsQuote className="tiptap-button-icon" />
      </Button>
      <AlignSelector editor={editor} />
      <ColorHighlightPopover editor={editor} />
      <LinkPopover editor={editor} />
      <Button>ﾙﾋﾞ</Button>
    </div>
  );
};

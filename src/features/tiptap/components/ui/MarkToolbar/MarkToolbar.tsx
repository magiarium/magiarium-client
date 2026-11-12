import { AlignCenterIcon } from '@/features/tiptap/components/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/features/tiptap/components/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/features/tiptap/components/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/features/tiptap/components/icons/AlignRightIcon';
import { ColorUnionPopover } from '@/features/tiptap/components/ui/ColorUnionPopover';
import { FontSizeDropdownMenu } from '@/features/tiptap/components/ui/FontSizeDropdownMenu';
import { InlineQuoteButton } from '@/features/tiptap/components/ui/InlineQuoteButton';
import { MarkButton } from '@/features/tiptap/components/ui/MarkButton';
import { RubyTextPopover } from '@/features/tiptap/components/ui/RubyTextButton';
import { TextAlignDropdownMenu } from '@/features/tiptap/components/ui/TextAlignDropdownMenu';
import { Editor } from '@tiptap/react';
import { Separator } from '../../ui-primitive/Separator';
import { InlineLinkPopover } from '../InlineLinkPopover';
import { KbdButton } from '../KbdButton/KbdButton';
import './MarkToolbar.scss';

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
      <Separator />
      <ColorUnionPopover editor={editor} />
      <FontSizeDropdownMenu editor={editor} />
      <TextAlignDropdownMenu editor={editor} />
      <Separator />
      <InlineLinkPopover editor={editor} autoOpenOnLinkActive={false} />
      <MarkButton editor={editor} type="code" />
      <InlineQuoteButton editor={editor} />
      <RubyTextPopover editor={editor} />
      <KbdButton editor={editor} />
    </div>
  );
};

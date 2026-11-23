import { Editor } from '@tiptap/react';
import { Separator } from '../../ui-primitive/Separator';
import { ColorUnionPopover } from '../ColorUnionPopover';
import { FontSizeDropdownMenu } from '../FontSizeDropdownMenu';
import { InlineLinkPopover } from '../InlineLinkPopover';
import { InlineQuoteButton } from '../InlineQuoteButton';
import { KbdButton } from '../KbdButton';
import { MarkButton } from '../MarkButton';
import {
  NodeDropdownMenuCustom,
  NodeDropdownMenuStandard,
} from '../NodeDropdownMenu';
import { RubyTextPopover } from '../RubyTextPopover';
import { TextAlignDropdownMenu } from '../TextAlignDropdownMenu';

/**
 * デフォルトコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const DefaultContextMenu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <NodeDropdownMenuStandard editor={editor} />
      <NodeDropdownMenuCustom editor={editor} />
      <Separator />
      {/** Mark修正系 */}
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
    </>
  );
};

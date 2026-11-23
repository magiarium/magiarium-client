import { Editor } from '@tiptap/react';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import { Separator } from '../../ui-primitive/Separator';
import { ColorUnionPopover } from '../ColorUnionPopover';
import { FontSizeDropdownMenu } from '../FontSizeDropdownMenu';
import { InlineLinkPopover } from '../InlineLinkPopover';
import { InlineQuoteButton } from '../InlineQuoteButton';
import { KbdButton } from '../KbdButton';
import { MarkButton } from '../MarkButton';
import { RubyTextPopover } from '../RubyTextPopover';
import { TextAlignDropdownMenu } from '../TextAlignDropdownMenu';

/**
 * キャプションコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const CaptionContextMenu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <Button
        type="button"
        role="button"
        tooltip="キャプション位置変更"
        variant="ghost"
        onClick={() => {
          editor.chain().focus().toggleCaptionSide().run();
        }}
      >
        {editor.getAttributes('caption').captionSide === 'bottom' ? (
          <BsArrowUp className="tiptap-button-icon" />
        ) : (
          <BsArrowDown className="tiptap-button-icon" />
        )}
        キャプション位置を変更
      </Button>
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

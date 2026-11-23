import { Editor } from '@tiptap/react';
import { BsTable } from 'react-icons/bs';
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
 * テーブルコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const TableContextMenu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <Button
        type="button"
        role="button"
        tooltip="テーブル削除"
        variant="ghost"
        onClick={() => {
          editor.chain().focus().deleteTable().run();
        }}
      >
        <BsTable className="tiptap-button-icon" />
        テーブル削除
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

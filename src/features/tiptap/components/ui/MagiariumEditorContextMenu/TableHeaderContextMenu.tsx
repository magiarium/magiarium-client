import { Editor } from '@tiptap/react';
import { BsToggleOn } from 'react-icons/bs';
import { MdCallMerge, MdCallSplit } from 'react-icons/md';
import {
  TbColumnInsertRight,
  TbColumnRemove,
  TbRowInsertBottom,
  TbRowRemove,
} from 'react-icons/tb';
import { Button } from '../../ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui-primitive/DropdownMenu';
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
 * テーブルヘッダーコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const TableHeaderContextMenu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            role="button"
            tooltip="テーブルヘッダー設定"
            variant="ghost"
          >
            テーブルヘッダー設定
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              role="button"
              tooltip="行を追加"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().addRowAfter().run();
              }}
            >
              <TbRowInsertBottom className="tiptap-button-icon" />
              行を追加
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              role="button"
              tooltip="行を削除"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().deleteRow().run();
              }}
            >
              <TbRowRemove className="tiptap-button-icon" />
              行を削除
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              role="button"
              tooltip="列を追加"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().addColumnAfter().run();
              }}
            >
              <TbColumnInsertRight className="tiptap-button-icon" />
              列を追加
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              role="button"
              tooltip="列を削除"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().deleteColumn().run();
              }}
            >
              <TbColumnRemove className="tiptap-button-icon" />
              列を削除
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              role="button"
              tooltip="セル結合"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().mergeCells().run();
              }}
            >
              <MdCallMerge className="tiptap-button-icon" />
              セル結合
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              role="button"
              tooltip="セル分割"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().splitCell().run();
              }}
            >
              <MdCallSplit className="tiptap-button-icon" />
              セル分割
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              role="button"
              tooltip="見出し切り替え"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().toggleHeaderCell().run();
              }}
            >
              <BsToggleOn className="tiptap-button-icon" />
              見出し切り替え
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

import { useCurrentNode } from '@/features/tiptap/hooks/useCurrentNode';
import { Editor } from '@tiptap/core';
import { ContextMenu as RadixContextMenu } from 'radix-ui';
import { ReactNode, useRef, useState } from 'react';

import { CaptionContextMenu } from './CaptionContextMenu';
import { CharacterSpeechContextMenu } from './CharacterSpeechContextMenu';
import { DefaultContextMenu } from './DefaultContextMenu';
import { ImageFigureContextMenu } from './ImageFigureContextMenu';
import { InlineLinkContextMenu } from './InlineLinkContextMenu';
import { LinkCardContextMenu } from './LinkCardContextMenu';
import './MagiariumEditorContextMenu.scss';
import { TableContextMenu } from './TableContextMenu';
import { TableHeaderContextMenu } from './TableHeaderContextMenu';
import { TableRowCellContextMenu } from './TableRowCellContextMenu';

/**
 * エディター全体のコンテキストメニュー
 *
 * @param params.children チルドレン
 * @param params.editor Tiptapエディターのインスタンス
 */
export const MagiariumEditorContextMenu = ({
  children,
  editor,
}: {
  children: ReactNode;
  editor: Editor;
}) => {
  // 編集権限がない場合は編集機能不要のため、チルドレンをそのまま返却
  if (!editor.isEditable) {
    return children;
  }
  const currentNode = useCurrentNode(editor);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isFilePickerOpen = useRef<boolean>(false);

  return (
    <RadixContextMenu.Root
      open={isOpen}
      onOpenChange={(nextOpen) => {
        // ファイル選択の開閉時にメニューが勝手に閉じてしまうため制御
        if (!nextOpen && isFilePickerOpen.current) {
          return;
        }

        setIsOpen(nextOpen);

        if (!nextOpen) {
          // DropdownMenuなどを階層的に利用した場合、下記が残ってしまうので明示的に削除
          requestAnimationFrame(() => {
            document.body.style.removeProperty('pointer-events');
          });
        }
      }}
    >
      <RadixContextMenu.Trigger>{children}</RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          onClickCapture={(event) => {
            const target = event.target as HTMLElement;

            if (target instanceof HTMLInputElement && target.type === 'file') {
              isFilePickerOpen.current = true;
            }
          }}
          onChangeCapture={(event) => {
            const target = event.target as HTMLElement;

            if (target instanceof HTMLInputElement && target.type === 'file') {
              isFilePickerOpen.current = false;
            }
          }}
        >
          <div className="magiarium-editor context-menu__content">
            {(() => {
              switch (currentNode) {
                case 'tableRowCell':
                  return <TableRowCellContextMenu editor={editor} />;

                case 'tableHeader':
                  return <TableHeaderContextMenu editor={editor} />;

                case 'table':
                case 'tableFigure':
                case 'tableRow':
                  return <TableContextMenu editor={editor} />;

                case 'caption':
                  return <CaptionContextMenu editor={editor} />;

                case 'imageFigure':
                case 'image':
                  return <ImageFigureContextMenu editor={editor} />;

                case 'inlineLink':
                  return <InlineLinkContextMenu editor={editor} />;

                case 'linkCard':
                  return <LinkCardContextMenu editor={editor} />;

                case 'characterSpeech':
                  return <CharacterSpeechContextMenu editor={editor} />;

                default:
                  return <DefaultContextMenu editor={editor} />;
              }
            })()}
          </div>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};

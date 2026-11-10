'use client';

import { MarkViewProps } from '@tiptap/core';
import { MarkViewContent, useEditorState } from '@tiptap/react';
import Link from 'next/link';
import { BsGearFill, BsTrash } from 'react-icons/bs';
import { FaUnlink } from 'react-icons/fa';
import { ExternalLinkIcon } from '../../icons/ExternalLinkIcon';
import { Button } from '../../ui-primitive/Button';
import { Card, CardBody } from '../../ui-primitive/Card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import { InlineLinkContent, useInlineLink } from '../../ui/InlineLinkPopover';
import './InlineLinkMark.scss';

export const InlineLinkMark = (props: MarkViewProps) => {
  const { editor } = props;
  if (editor.isEditable) {
    return EditableInlineLinkMark(props);
  }
  const { href, icon, target, rel } = props.mark.attrs;

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="inline-link"
      style={
        icon
          ? ({ '--inline-link-icon': `url("${icon}")` } as React.CSSProperties)
          : undefined
      }
    >
      <span className="inline-link__text">
        <MarkViewContent />
      </span>
    </Link>
  );
};

const EditableInlineLinkMark = (props: MarkViewProps) => {
  const { editor } = props;
  const { inlineLinkState, openLink, setInlineLinkState, removeInlineLink } =
    useInlineLink({ editor });

  const selected = useEditorState({
    editor,
    selector: ({ editor }) => {
      const { selection } = editor.state;
      const marks = selection.$from.marks();
      return marks.some((mark) => mark.type.name === 'link');
    },
  });

  const icon = selected ? inlineLinkState.icon : props.mark.attrs.icon;

  return (
    <Popover modal={true}>
      <PopoverTrigger>
        <span
          className="inline-link"
          style={
            icon
              ? ({
                  '--inline-link-icon': `url("${icon}")`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <span className="inline-link__text">
            <MarkViewContent />
          </span>
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <Card>
          <CardBody>
            <Button
              variant="ghost"
              onClick={() => {
                openLink();
              }}
              disabled={
                selected ? !inlineLinkState.href : props.mark.attrs.href
              }
            >
              <ExternalLinkIcon className="tiptap-button-icon" />
              リンクを開く
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <BsGearFill className="tiptap-button-icon" />
                  表示内容を編集する
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <InlineLinkContent editor={editor} />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              onClick={() => {
                removeInlineLink();
              }}
            >
              <FaUnlink className="tiptap-button-icon" />
              リンク解除
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                editor.chain().focus().deleteSelection().run();
              }}
            >
              <BsTrash className="tiptap-button-icon" />
              破棄する
            </Button>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

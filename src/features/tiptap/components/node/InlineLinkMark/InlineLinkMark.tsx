'use client';

import { useAsyncResourceStyle } from '@/common/hooks/useAsyncResourceStyle';
import { sanitizeUrl } from '@/features/tiptap/lib/tiptapUtils';
import { MarkViewProps } from '@tiptap/core';
import { Mark } from '@tiptap/pm/model';
import { MarkViewContent } from '@tiptap/react';
import Link from 'next/link';
import { BsArrowUpRight } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import { Card, CardBody } from '../../ui-primitive/Card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import './InlineLinkMark.scss';

export const InlineLinkMark = ({ editor, mark }: MarkViewProps) => {
  if (editor.isEditable) {
    return <EditableInlineLinkMark mark={mark} />;
  }
  const { href, icon, target, rel } = mark.attrs;

  const style = useAsyncResourceStyle(icon?.src, {
    property: '--inline-link-icon',
  });

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="tiptap-inline-link"
      style={style}
    >
      <span className="inline-link__text">
        <MarkViewContent />
      </span>
    </Link>
  );
};

const EditableInlineLinkMark = ({ mark }: { mark: Mark }) => {
  const style = useAsyncResourceStyle(mark.attrs.icon?.src, {
    property: '--inline-link-icon',
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="tiptap-inline-link" style={style}>
          <span className="tiptap-inline-link__text">
            <MarkViewContent />
          </span>
        </span>
      </PopoverTrigger>
      <PopoverContent portal>
        <Card>
          <CardBody>
            <Button
              variant="ghost"
              onClick={() => {
                const safeUrl = sanitizeUrl(
                  mark.attrs.href,
                  window.location.href
                );
                window.open(safeUrl, '_blank', 'noopener,noreferrer');
              }}
              disabled={!mark.attrs.href}
            >
              <BsArrowUpRight className="tiptap-button-icon" />
              リンクを開く
            </Button>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

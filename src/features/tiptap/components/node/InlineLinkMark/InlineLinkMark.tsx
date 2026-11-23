'use client';

import { MarkViewProps } from '@tiptap/core';
import { MarkViewContent } from '@tiptap/react';
import Link from 'next/link';
import './InlineLinkMark.scss';

export const InlineLinkMark = (props: MarkViewProps) => {
  const { href, icon, target, rel } = props.mark.attrs;

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="tiptap-inline-link"
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

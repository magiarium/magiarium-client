'use client';

import { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

// --- Style ---
import './LinkCardNode.scss';

/**
 * リンクカードノード
 */
export const LinkCardNode = (props: NodeViewProps): ReactNode => {
  const { href, thumbnailUrl, title, description, target } = props.node.attrs;

  return (
    <NodeViewWrapper className={classNames('tiptap-link-card')}>
      <Link href={href} target={target}>
        <div className="tiptap-link-card__capture">
          {thumbnailUrl ? (
            <Image
              className="tiptap-link-card__image"
              src={thumbnailUrl}
              alt="リンクカード画像"
              width={1200}
              height={800}
            />
          ) : (
            <span className="tiptap-link-card__image">
              画像が設定されていません。
            </span>
          )}
          <span className="tiptap-link-card__link">{href}</span>
        </div>
        <span className="tiptap-link-card__title">{title}</span>
        <span className="tiptap-link-card__description">{description}</span>
      </Link>
    </NodeViewWrapper>
  );
};

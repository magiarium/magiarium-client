'use client';

import { Image } from '@/common/components/Image';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import { Card, CardBody } from '@/features/tiptap/components/ui-primitive/Card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';
import { sanitizeUrl } from '@/features/tiptap/lib/tiptapUtils';
import { NodeViewProps } from '@tiptap/core';
import { Node } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import classNames from 'classnames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { BsArrowUpRight } from 'react-icons/bs';

// --- Style ---
import './LinkCardNode.scss';

/**
 * リンクカードノード
 */
export const LinkCardNode = ({
  node,
  editor,
  updateAttributes,
  deleteNode,
}: NodeViewProps): ReactNode => {
  if (editor.isEditable) {
    return (
      <EditableLinkCardNode
        node={node}
        updateAttributes={updateAttributes}
        deleteNode={deleteNode}
      />
    );
  }

  const { href, thumbnail, title, description, target } = node.attrs;

  return (
    <NodeViewWrapper className={classNames('tiptap-link-card')}>
      <Link href={href ?? ''} target={target}>
        <div className="tiptap-link-card__capture">
          {thumbnail?.src ? (
            <Image
              className="tiptap-link-card__image"
              src={thumbnail.src}
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

/**
 * 編集可能リンクカード
 */
const EditableLinkCardNode = ({
  node,
  updateAttributes,
  deleteNode,
}: {
  node: Node;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
}) => {
  return (
    <NodeViewWrapper className={classNames('tiptap-link-card')}>
      <Popover>
        <PopoverTrigger>
          <div className="tiptap-link-card__capture">
            {node.attrs.thumbnail?.src ? (
              <Image
                className="tiptap-link-card__image"
                src={node.attrs.thumbnail.src}
                alt="リンクカード画像"
                width={1200}
                height={800}
              />
            ) : (
              <span className="tiptap-link-card__image">
                画像が設定されていません。
              </span>
            )}
            <span className="tiptap-link-card__link">{node.attrs.href}</span>
          </div>
          <span className="tiptap-link-card__title">{node.attrs.title}</span>
          <span className="tiptap-link-card__description">
            {node.attrs.description}
          </span>
        </PopoverTrigger>
        <PopoverContent>
          <Card>
            <CardBody>
              <Button
                variant="ghost"
                onClick={() => {
                  const safeUrl = sanitizeUrl(
                    node.attrs.href,
                    window.location.href
                  );
                  window.open(safeUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <BsArrowUpRight className="tiptap-button-icon" />
                リンクを開く
              </Button>
            </CardBody>
          </Card>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};

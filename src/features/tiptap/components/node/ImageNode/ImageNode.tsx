import { Image } from '@/common/components/Image';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { ReactNode } from 'react';

export const ImageNode = (props: NodeViewProps): ReactNode => {
  const { src, alt, title, originalHeight, originalWidth } = props.node.attrs;

  return (
    <NodeViewWrapper>
      <Image
        src={src}
        alt={alt}
        title={title}
        width={originalWidth}
        height={originalHeight}
        className="tiptap-image"
      />
    </NodeViewWrapper>
  );
};

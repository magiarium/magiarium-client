import { BlogItemMetadata } from '@magiarium/structure';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip } from 'radix-ui';
import { useState } from 'react';
import { BlogListDtailTooltip } from './BlogList.DetailTooltip';
import './BlogList.Record.scss';

/**
 * ブログ一覧 - レコード
 */
export const BlogListRecord = ({
  metadata,
}: {
  metadata: BlogItemMetadata;
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(
    metadata.thumbnailImage.path
  );

  return (
    <Tooltip.Root>
      {/** 行データ本体 */}
      <Tooltip.Trigger asChild>
        <Link
          className="blog-list record__link"
          href={
            metadata.itemState !== 'draft'
              ? `/blog/${metadata.itemId}`
              : `/blog/${metadata.itemId}/draft`
          }
        >
          <Image
            className="blog-list record__thumbnail"
            src={thumbnailSrc}
            alt={'ブログ記事サムネイル'}
            width={515}
            height={515}
            onError={() =>
              setThumbnailSrc('/assets/images/default-blog-icon.png')
            }
          />
          <span className="blog-list record__subject">{metadata.title}</span>

          <time className="blog-list record__date">{metadata.publishedAt}</time>
        </Link>
      </Tooltip.Trigger>
      {/** 詳細ツールチップ */}
      <Tooltip.Portal>
        <BlogListDtailTooltip metadata={metadata} />
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

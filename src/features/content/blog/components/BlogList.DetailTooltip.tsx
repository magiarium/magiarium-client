import { BlogItemMetadata } from '@magiarium/structure';
import Image from 'next/image';
import { Tooltip } from 'radix-ui';
import { useState } from 'react';
import './BlogList.DetailTooltip.scss';
/**
 * ブログ一覧 - 詳細ツールチップ
 */
export const BlogListDtailTooltip = ({
  metadata,
}: {
  metadata: BlogItemMetadata;
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(
    metadata.thumbnailImage.path
  );
  return (
    <Tooltip.Content
      className="blog-list tooltip__container"
      side="bottom"
      sideOffset={8}
    >
      <Image
        className="blog-list tooltip__thumbnail"
        src={thumbnailSrc || '/assets/images/default-blog-icon.png'}
        alt="ブログ記事サムネイル"
        width={515}
        height={515}
        onError={() => setThumbnailSrc('/assets/images/default-blog-icon.png')}
      />

      <div className="blog-list tooltip__body">
        <span className="blog-list tooltip__title">{metadata.title}</span>

        <p className="blog-list tooltip__description">{metadata.description}</p>

        <div className="blog-list tooltip__meta">
          <div className="blog-list tooltip__meta-item">
            <span className="blog-list tooltip__label">最終更新</span>
            <time>{metadata.updatedAt}</time>
          </div>

          <div className="blog-list tooltip__meta-item">
            <span className="blog-list tooltip__label">閲覧数</span>
            <span>{metadata.viewCount}</span>
          </div>
        </div>
      </div>

      <Tooltip.Arrow className="blog-list tooltip__arrow" />
    </Tooltip.Content>
  );
};

import { LoadingCircle } from '@/common/components/LoadingCircle';
import { BlogItemMetadata } from '@magiarium/structure';
import { Tooltip } from 'radix-ui';
import { BsArrowClockwise } from 'react-icons/bs';
import { ContentApiRequest } from '../../common/constants';
import { useFetchContentApi } from '../../common/hooks/useFetchContentApi';
import './BlogList.Content.scss';
import { BlogListRecord } from './BlogList.Record';

/**
 * ブログ一覧用の型定義(下書きと公開済みの２種を想定)
 */
type BlogItemListUnionType =
  'GetDraftItemMetadataList' | 'GetPublicItemMetadataList';

/**
 * ブログ一覧 - コンテンツ
 */
export const BlogListContent = <
  T extends BlogItemListUnionType = BlogItemListUnionType,
>({
  target,
  request,
}: {
  target: T;
  request: ContentApiRequest<T>;
}) => {
  const { result, refresh, isLoading } =
    useFetchContentApi<BlogItemListUnionType>(target, request);

  if (isLoading) {
    return (
      <>
        ローディング中
        <LoadingCircle />
      </>
    );
  }

  let blogItemMetadataList: BlogItemMetadata[] = [];
  if (!result || !result.success) {
    if (
      result?.error.details?.filter(
        (target) => target.errorType === 'NOT_FOUND'
      ).length !== 0
    ) {
      // 件数がない場合は正常扱い
      return <>検索結果が見つかりません</>;
    }
    return <>システムエラー</>;
  } else {
    blogItemMetadataList = result?.results;
  }

  return (
    <Tooltip.Provider delayDuration={100}>
      <div className="blog-list content__header">
        <span className="blog-list content__header-title">
          投稿記事一覧
          <button
            className="blog-list content__reload"
            onClick={() => {
              refresh();
            }}
          >
            <BsArrowClockwise />
          </button>
        </span>
        <span className="blog-list content__total">
          {blogItemMetadataList.length}件
        </span>
      </div>

      <div className="blog-list content__records">
        <ul>
          {blogItemMetadataList.map((targetItem, index) => {
            return (
              <li key={`blog-list-item-${index}`}>
                <BlogListRecord metadata={targetItem} />
              </li>
            );
          })}
        </ul>
      </div>
    </Tooltip.Provider>
  );
};

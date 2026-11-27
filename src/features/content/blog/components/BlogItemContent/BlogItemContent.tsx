'use client';

import { LoadingCircle } from '@/common/components/LoadingCircle/LoadingCircle';
import { useFetchContentApi } from '@/features/api/hooks/useFetchContentApi';
import { MagiariumEditor } from '@/features/tiptap/components/ui/MagiariumEditor';
import { ItemId, ItemState } from '@magiarium/structure';
import './BlogItemContent.scss';

export const BlogContent = ({
  itemState,
  itemId,
}: {
  itemState: ItemState;
  itemId: ItemId;
}) => {
  const request =
    itemState === 'draft'
      ? {
          params: {
            itemId: itemId,
            itemType: 'blog' as const,
          },
        }
      : {
          params: {
            itemId: itemId,
            itemType: 'blog' as const,
          },
        };

  const { result, isLoading } =
    itemState === 'draft'
      ? useFetchContentApi('GetDraftItemData', request)
      : useFetchContentApi('GetPublicItemData', request);

  if (isLoading) {
    return (
      <>
        ローディング中 <LoadingCircle />
      </>
    );
  }

  if (!result || !result.success) {
    return <>システムエラー</>;
  }
  const itemData = result.results;
  return (
    <article className="blog-content__container">
      <div className="blog-content__header">
        <h2>{itemData.title}</h2>
      </div>
      <div className="blog-content__main">
        <MagiariumEditor itemData={itemData} />
      </div>
    </article>
  );
};

'use client';

import { Button } from '@/common/components/Button';
import { LoadingCircle } from '@/common/components/LoadingCircle';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { MagiariumEditor } from '@/features/tiptap/custom/components/MagiariumEditor';
import { ItemId, ItemState } from '@magiarium/structure';
import { useFetchContentApi } from '../../common/hooks/useFetchContentApi';
import './BlogItem.Content.scss';

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

  const { can } = usePermission();

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
        <MagiariumEditor content={itemData.content} isEditable={can('EDIT')} />
      </div>
      {can('EDIT') && (
        <aside className="blog-content__edit-aside">
          {can('SAVE:DRAFT') && <Button onClick={() => {}}>下書き保存</Button>}
          {itemData.itemState === 'draft' && can('SAVE:PUBLIC') && (
            <Button onClick={() => {}} priority={'SECONDARY'}>
              下書き公開
            </Button>
          )}
        </aside>
      )}
    </article>
  );
};

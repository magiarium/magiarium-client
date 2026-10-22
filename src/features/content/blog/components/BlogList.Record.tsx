import { Button } from '@/common/components/Button';
import { ContextMenu } from '@/common/components/ContextMenu';
import { useNotice } from '@/features/app-controller/hooks/useNotice';
import { useWindowController } from '@/features/desktop/hooks/useWindowController';
import { WindowControllerId } from '@/features/desktop/type';
import { BlogItemMetadata } from '@magiarium/structure';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip } from 'radix-ui';
import { useState } from 'react';
import { BsPencilFill, BsTrashFill } from 'react-icons/bs';
import { MetadataEditor } from '../../common/components/MetadataEditor';
import { fetchContentApi } from '../../common/libs/fetchContentApi';
import { BlogListDtailTooltip } from './BlogList.DetailTooltip';
import './BlogList.Record.scss';

/**
 * ブログ一覧 - レコード
 */
export const BlogListRecord = ({
  metadata,
  refresh,
  onLoading,
}: {
  metadata: BlogItemMetadata;
  refresh: () => Promise<void>;
  onLoading: (isLoading: boolean) => void;
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(
    metadata.thumbnailImage.path
  );
  const { setNotice, closeNotice } = useNotice();
  const { createWindowController } = useWindowController();

  return (
    <Tooltip.Root>
      {/** 行データ本体 */}
      <ContextMenu
        contextItems={
          metadata.itemState === 'draft'
            ? [
                {
                  children: (
                    <>
                      <BsPencilFill />
                      メタデータ編集
                    </>
                  ),
                  onSelect: async () => {
                    onLoading(true);
                    const itemData = await fetchContentApi('GetDraftItemData', {
                      params: {
                        itemId: metadata.itemId,
                        itemType: metadata.itemType,
                      },
                    });
                    if (!itemData.success) {
                      return;
                    }
                    const windowController = createWindowController({
                      id: 'blog-metadata-edit' as WindowControllerId,
                      children: (
                        <>
                          {itemData.success ? (
                            <MetadataEditor
                              itemData={itemData.results}
                              onClose={() => {
                                windowController.setWindowState('CLOSED');
                                windowController.delete();
                              }}
                            />
                          ) : (
                            <>対象コンテンツが見つかりません。</>
                          )}
                        </>
                      ),
                      title: 'ブログメタデータ編集',
                    });
                    onLoading(false);
                  },
                },
                {
                  children: (
                    <>
                      <BsTrashFill />
                      下書き削除
                    </>
                  ),
                  onSelect: () => {
                    setNotice({
                      title: '最終確認',
                      type: 'ALERT',
                      children: (
                        <div className="delete-confirm">
                          <span>本当に削除しますか？</span>
                          <div className="delete-confirm__actions">
                            <Button
                              onClick={() => {
                                closeNotice();
                              }}
                              priority={'SECONDARY'}
                            >
                              いいえ
                            </Button>
                            <Button
                              onClick={async () => {
                                onLoading(true);
                                closeNotice();
                                await fetchContentApi('DeleteDraftItemData', {
                                  params: {
                                    itemId: metadata.itemId,
                                    itemType: metadata.itemType,
                                  },
                                });
                                await refresh();
                                onLoading(false);
                              }}
                            >
                              はい
                            </Button>
                          </div>
                        </div>
                      ),
                    });
                  },
                },
              ]
            : undefined
        }
      >
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
              src={thumbnailSrc || '/assets/images/default-blog-icon.png'}
              alt={'ブログ記事サムネイル'}
              width={515}
              height={515}
              onError={() =>
                setThumbnailSrc('/assets/images/default-blog-icon.png')
              }
            />
            <span className="blog-list record__subject">{metadata.title}</span>

            <time className="blog-list record__date">
              {metadata.publishedAt}
            </time>
          </Link>
        </Tooltip.Trigger>
      </ContextMenu>
      {/** 詳細ツールチップ */}
      <Tooltip.Portal>
        <BlogListDtailTooltip metadata={metadata} />
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

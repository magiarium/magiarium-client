'use client';

import { usePermission } from '@/features/auth/hooks/usePermission';
import { useWindowController } from '@/features/desktop/hooks/useWindowController';
import { WindowControllerId } from '@/features/desktop/type';
import { Tabs } from 'radix-ui';
import { BsEnvelope, BsPlusSquareFill } from 'react-icons/bs';
import { BlogMetadataEditor } from '../../common/components/MetadataEditor';
import { createBlogItemTemplate } from '../libs/createBlogItemTemplate';
import { BlogListContent } from './BlogList.Content';
import './BlogList.scss';

/**
 * ブログ一覧
 */
export const BlogList = () => {
  const { can } = usePermission();
  const { createWindowController } = useWindowController();

  return (
    <Tabs.Root className="blog-list__container" defaultValue="public-blog-list">
      {/** サイドバー */}
      <aside className="blog-list__sidebar">
        {can('EDIT') && (
          <button
            className="blog-list__button"
            onClick={() => {
              createWindowController({
                id: 'blog-metadata-edit' as WindowControllerId,
                children: (
                  <BlogMetadataEditor itemData={createBlogItemTemplate()} />
                ),
                title: 'ブログメタデータ編集',
              });
            }}
          >
            <span>新規作成</span>
            <BsPlusSquareFill />
          </button>
        )}
        <nav>
          <Tabs.List className="blog-list__tabs">
            <li>
              <Tabs.Trigger value="public-blog-list" className="blog-list__tab">
                <BsEnvelope />
                投稿記事一覧
              </Tabs.Trigger>
            </li>
            {can('READ:DRAFT') && (
              <li>
                <Tabs.Trigger
                  value="draft-blog-list"
                  className="blog-list__tab"
                >
                  <BsEnvelope />
                  下書き
                </Tabs.Trigger>
              </li>
            )}
          </Tabs.List>
        </nav>
      </aside>
      {/** メインコンテンツ */}
      <div className="blog-list__body">
        <Tabs.Content value="public-blog-list">
          <BlogListContent
            target={'GetPublicItemMetadataList'}
            request={{
              params: { itemType: 'blog' },
              query: {},
            }}
          />
        </Tabs.Content>
        <Tabs.Content value="draft-blog-list">
          <BlogListContent
            target={'GetDraftItemMetadataList'}
            request={{
              params: { itemType: 'blog' },
            }}
          />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};

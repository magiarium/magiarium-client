import { INITIAL_IMAGE_METADATA } from '@/common/constants';
import { getNowDateTimeString } from '@/common/libs/getNowDatetimeString';
import { ItemData } from '@magiarium/structure';

/**
 * BlogItemテンプレート(初期データ)作成処理
 * @returns BlogItemテンプレート
 */
export const createBlogItemTemplate = (): ItemData => {
  const nowDateTimeString = getNowDateTimeString();
  return {
    itemId: nowDateTimeString,
    itemType: 'blog',
    itemState: 'draft',
    title: '',
    description: '',
    searchKey: {
      category: [],
      tag: [],
    },
    thumbnailImage: INITIAL_IMAGE_METADATA,
    ogpImage: INITIAL_IMAGE_METADATA,
    createdAt: nowDateTimeString,
    updatedAt: nowDateTimeString,
    publishedAt: '00000000000000',
    viewCount: 0,

    content: {},
  };
};

import { ApiResultBase, ItemData } from '@magiarium/structure';
import { fetchContentApi } from './fetchContentApi';
import { uploadResourceAndReplacePath } from './uploadResourceAndReplacePath';

export const saveItemData = async ({
  editItemData,
}: {
  editItemData: ItemData;
}): Promise<ApiResultBase<ItemData>> => {
  try {
    // サムネイル画像
    const uploadThumbnailResult = await uploadResourceAndReplacePath({
      itemId: editItemData.itemId,
      itemType: editItemData.itemType,
      imageMetadata: editItemData.thumbnailImage,
    });
    if (!uploadThumbnailResult.success) {
      throw new Error('サムネイル画像のアップロードに失敗しました。');
    }
    // OGP画像
    const uploadOgpResult = await uploadResourceAndReplacePath({
      itemId: editItemData.itemId,
      itemType: editItemData.itemType,
      imageMetadata: editItemData.ogpImage,
    });
    if (!uploadOgpResult.success) {
      throw new Error('OGP画像のアップロードに失敗しました。');
    }

    // データ保存
    const result = await fetchContentApi('SaveDraftItemData', {
      params: {
        itemId: editItemData.itemId,
        itemType: editItemData.itemType,
      },
      body: editItemData,
    });
    if (!result.success) {
      throw new Error('データ保存に失敗しました。');
    }
    return {
      success: true,
      results: editItemData,
    };
  } catch {
    return {
      success: false,
      error: {
        message: 'データ保存に失敗しました。',
      },
    };
  }
};

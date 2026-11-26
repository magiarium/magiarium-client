import { ApiResultBase, ItemData } from '@magiarium/structure';
import { fetchContentApi } from './fetchContentApi';
import { uploadResources } from './uploadResources';

export const saveItemData = async ({
  editItemData,
}: {
  editItemData: ItemData;
}): Promise<ApiResultBase<ItemData>> => {
  try {
    // リソース保存
    const uploadResouceResult = await uploadResources(editItemData);
    if (!uploadResouceResult.success) {
      return {
        success: false,
        error: {
          message: 'リソースファイルのアップロードに失敗しました。',
          details: uploadResouceResult.error.details,
        },
      };
    }

    // データ保存
    const result = await fetchContentApi('SaveDraftItemData', {
      params: {
        itemId: editItemData.itemId,
        itemType: editItemData.itemType,
      },
      body: uploadResouceResult.results,
    });
    if (!result.success) {
      throw new Error('データ保存に失敗しました。');
    }
    return {
      success: true,
      results: uploadResouceResult.results,
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

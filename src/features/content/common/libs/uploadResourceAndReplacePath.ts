import { MAGIARIUM_BUCKET_NAME } from '@/constants';
import {
  ApiResultBase,
  ImageMetadata,
  ItemId,
  ItemType,
} from '@magiarium/structure';
import { uploadData } from 'aws-amplify/storage';

export const uploadResourceAndReplacePath = async ({
  itemId,
  itemType,
  imageMetadata,
}: {
  itemId: ItemId;
  itemType: ItemType;
  imageMetadata: ImageMetadata;
}): Promise<ApiResultBase<string>> => {
  try {
    if (!imageMetadata.path.startsWith('blob:')) {
      // blobURL以外の場合、既にアップロード済みのため処理不要
      return { success: true, results: imageMetadata.path };
    }
    const response = await fetch(imageMetadata.path);
    const imageBlob = await response.blob();
    const file = new File([imageBlob], imageMetadata.fileName, {
      type: imageBlob.type,
    });
    const uploadResult = await uploadData({
      path: `items/${itemType}/${itemId}/draft/resources/${imageMetadata.fileName}`,
      data: file,
      options: {
        bucket: {
          bucketName: MAGIARIUM_BUCKET_NAME,
          region: 'ap-northeast-1',
        },
      },
    }).result;
    if (!uploadResult.path) {
      throw new Error('アップロードパスがないため不正');
    }
    // アップロード成功時にパスを更新
    imageMetadata.path = `/${uploadResult.path}`;

    return { success: true, results: uploadResult.path };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: {
        message: 'リソースのアップロードに失敗しました。',
      },
    };
  }
};

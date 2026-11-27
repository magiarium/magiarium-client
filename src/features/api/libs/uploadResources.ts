import { MAGIARIUM_BUCKET_NAME } from '@/constants';
import { ApiResultBase, ErrorDetail, ItemData } from '@magiarium/structure';
import { JSONContent } from '@tiptap/react';
import { uploadData } from 'aws-amplify/storage';

type BlobResource = {
  nodeType: string;
  attribute: string;
  path: number[];
  storageKey: string;
  blob: Blob;
};

const extensionMap: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/json': 'json',
  'application/zip': 'zip',
  'video/mp4': 'mp4',
  'audio/mpeg': 'mp3',
};

export const uploadResources = async (
  itemData: ItemData
): Promise<ApiResultBase<ItemData>> => {
  const resources: BlobResource[] = [];
  // サムネイル画像
  if (itemData.thumbnailImage.src.startsWith('blob:')) {
    const blob = await fetch(itemData.ogpImage.src).then((res) => res.blob());
    resources.push({
      nodeType: 'thumbnailImage',
      attribute: 'storageKey',
      path: [],

      storageKey: 'thumbnail.webp',
      blob,
    });
  }

  // OGP画像
  if (itemData.ogpImage.src.startsWith('blob:')) {
    const blob = await fetch(itemData.ogpImage.src).then((res) => res.blob());
    resources.push({
      nodeType: 'ogpImage',
      attribute: 'storageKey',
      path: [],

      storageKey: 'ogp.webp',
      blob,
    });
  }

  // コンテンツリソース
  const traverse = async (node: JSONContent, path: number[] = []) => {
    await Promise.all(
      Object.entries(node.attrs ?? {}).map(async ([attribute, value]) => {
        if (typeof value === 'string' && value.startsWith('blob:')) {
          const blob = await fetch(value).then((res) => res.blob());

          const extension = extensionMap[blob.type] ?? 'bin';
          const fileName = `${node.attrs?.uploadedAt}.${extension}`;

          resources.push({
            nodeType: node.type ?? 'unknown',
            attribute,
            path,

            storageKey: `resources/${fileName}`,
            blob,
          });
        }
      })
    );

    await Promise.all(
      (node.content ?? []).map((child, index) =>
        traverse(child, [...path, index])
      )
    );
  };

  await traverse(itemData.content);

  // 1. 並列アップロード
  const errorDetails: ErrorDetail[] = [];
  const uploadedResources = await Promise.all(
    resources.map(async (targetResource) => {
      const file = new File(
        [targetResource.blob],
        targetResource.storageKey.split('/').pop() ?? 'unknown.bin',
        {
          type: targetResource.blob.type,
        }
      );

      const uploadResult = await uploadData({
        path: `items/${itemData.itemType}/${itemData.itemId}/draft/${targetResource.storageKey}`,
        data: file,
        options: {
          bucket: {
            bucketName: MAGIARIUM_BUCKET_NAME,
            region: 'ap-northeast-1',
          },
        },
      }).result;

      if (!uploadResult.path) {
        errorDetails.push({
          field:
            targetResource.path.length === 0
              ? targetResource.attribute
              : `content.${targetResource.path.join('.')}.${targetResource.attribute}`,
          errorType: 'SYSTEM_ERROR',
          issue: 'リソースファイルのアップロードに失敗しました。',
        });
      }

      return {
        ...targetResource,
        uploadedPath: uploadResult.path ?? '',
      };
    })
  );

  // 2. アップロード結果を使ってdocを更新
  const updatedItemData = structuredClone(itemData);

  for (const targetResource of uploadedResources) {
    // サムネイル画像
    if (targetResource.nodeType === 'thumbnailImage') {
      updatedItemData.thumbnailImage.src = targetResource.uploadedPath;
      continue;
    }

    // OGP画像
    if (targetResource.nodeType === 'ogplImage') {
      updatedItemData.ogpImage.src = targetResource.uploadedPath;
      continue;
    }
    // コンテンツデータ
    let targetNode: JSONContent = updatedItemData.content;

    // pathをたどって対象ノードを取得
    for (const index of targetResource.path) {
      const child = targetNode.content?.[index];

      if (!child) {
        errorDetails.push({
          field: `content.${targetResource.path.join('.')}.${targetResource.attribute}`,
          errorType: 'SYSTEM_ERROR',
          issue: '対象ノードが見つかりません',
        });
        continue;
      }

      targetNode = child;
    }

    // blob URLをアップロード先のパスに置き換え
    targetNode.attrs = {
      ...targetNode.attrs,
      [targetResource.attribute]: targetResource.uploadedPath,
    };
  }

  if (errorDetails.length !== 0) {
    return {
      success: false,
      error: {
        message: 'リソースファイルのアップロードに失敗しました。',
        details: errorDetails,
      },
    };
  }
  return {
    success: true,
    results: updatedItemData,
  };
};

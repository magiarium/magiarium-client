import {
  CustomError,
  DeleteDraftItemDataRequest,
  DeleteDraftItemDataResult,
  GetDraftItemDataRequest,
  GetDraftItemDataResult,
  GetDraftItemMetadataListRequest,
  GetDraftItemMetadataListResult,
  GetPublicItemDataRequest,
  GetPublicItemDataResult,
  GetPublicItemMetadataListRequest,
  GetPublicItemMetadataListResult,
  ImageMetadata,
  PublishDraftItemDataRequest,
  PublishDraftItemDataResult,
  SaveDraftItemDataRequest,
  SaveDraftItemDataResult,
} from '@magiarium/structure';

/**
 * コンテンツAPI定義
 */
export const COTENT_API_DEFINES = {
  GetDraftItemMetadataList: {
    label: '下書きアイテムメタデータ一覧取得',
    path: '/item/{itemType}/draft',
    method: 'GET',
    headers: {},
    isAuth: true,
  },
  GetPublicItemMetadataList: {
    label: '公開アイテムメタデータ一覧取得',
    path: '/item/{itemType}/public',
    method: 'GET',
    headers: {},
    isAuth: false,
  },
  GetDraftItemData: {
    label: '下書きアイテムデータ取得',
    path: '/item/{itemType}/draft/{itemId}',
    method: 'GET',
    headers: {},
    isAuth: true,
  },
  GetPublicItemData: {
    label: '公開アイテムデータ取得',
    path: '/item/{itemType}/public/{itemId}',
    method: 'GET',
    headers: {},
    isAuth: false,
  },
  SaveDraftItemData: {
    label: '下書きアイテムデータ保存',
    path: '/item/{itemType}/draft/{itemId}',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    isAuth: true,
  },
  PublishDraftItemData: {
    label: '下書きアイテムデータ公開',
    path: '/item/{itemType}/public/{itemId}',
    method: 'POST',
    headers: {},
    isAuth: true,
  },
  DeleteDraftItemData: {
    label: '下書きデータ削除',
    path: '/item/{itemType}/draft/{itemId}',
    method: 'DELETE',
    headers: {},
    isAuth: true,
  },
} as const;

/**
 * コンテンツAPI（リクエスト&リザルト）用の型定義
 */
type ContentApiTypes = {
  GetDraftItemMetadataList: {
    Request: GetDraftItemMetadataListRequest;
    Result: GetDraftItemMetadataListResult;
  };

  GetPublicItemMetadataList: {
    Request: GetPublicItemMetadataListRequest;
    Result: GetPublicItemMetadataListResult;
  };

  GetDraftItemData: {
    Request: GetDraftItemDataRequest;
    Result: GetDraftItemDataResult;
  };

  GetPublicItemData: {
    Request: GetPublicItemDataRequest;
    Result: GetPublicItemDataResult;
  };

  SaveDraftItemData: {
    Request: SaveDraftItemDataRequest;
    Result: SaveDraftItemDataResult;
  };

  PublishDraftItemData: {
    Request: PublishDraftItemDataRequest;
    Result: PublishDraftItemDataResult;
  };

  DeleteDraftItemData: {
    Request: DeleteDraftItemDataRequest;
    Result: DeleteDraftItemDataResult;
  };
};

/**
 * コンテンツAPI名型定義
 */
export type ContentApiName = keyof typeof COTENT_API_DEFINES &
  keyof ContentApiTypes;

/**
 * コンテンツAPIリクエスト型定義
 */
export type ContentApiRequest<T extends ContentApiName> =
  ContentApiTypes[T]['Request'];

/**コンテンツAPIリザルト型定義
 *
 */
export type ContentApiResult<T extends ContentApiName> =
  ContentApiTypes[T]['Result'];

/**
 * コンテンツAPIインターフェース
 */
export type ContentApiInterface<T extends ContentApiName = ContentApiName> = {
  ContentApiRequest: ContentApiRequest<T>;
  ContentApiResult: ContentApiResult<T>;
  ContentApiResponse: ContentApiResponse<T>;
  CustomError: CustomError<ContentApiResult<T>>;
};
/**
 * APIレスポンス
 */
type ContentApiResponse<T extends ContentApiName = ContentApiName> = {
  /** ステータスコード */
  statusCode: number;
  /** レスポンスボディ */
  body: ContentApiResult<T>;
};

export const THUMBNAIL_TEMPLATES: ImageMetadata[] = [
  {
    path: '/assets/images/thumbnail/template_1.webp',
    mimeType: 'image/webp',
    alt: 'サムネイル画像',
    title: 'thumbnail.webp',
    attributes: {
      height: 515,
      width: 515,
    },
    uploadedAt: '20261018155000',
  },
  {
    path: '/assets/images/thumbnail/template_2.webp',
    mimeType: 'image/webp',
    alt: 'サムネイル画像',
    title: 'thumbnail.webp',
    attributes: {
      height: 515,
      width: 515,
    },
    uploadedAt: '20261018155000',
  },
];

export const OGP_TEMPLATES: ImageMetadata[] = [
  {
    path: '/assets/images/ogp/template_1.webp',
    mimeType: 'image/webp',
    alt: 'OGP画像',
    title: 'ogp.webp',
    attributes: {
      height: 630,
      width: 1200,
    },
    uploadedAt: '20261018155000',
  },
  {
    path: '/assets/images/ogp/template_2.webp',
    mimeType: 'image/webp',
    alt: 'OGP画像',
    title: 'ogp.webp',
    attributes: {
      height: 630,
      width: 1200,
    },
    uploadedAt: '20261018155000',
  },
];

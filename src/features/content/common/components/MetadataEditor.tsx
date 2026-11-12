'use client';
import { Button } from '@/common/components/Button';
import { LoadingCircle } from '@/common/components/LoadingCircle';
import { useNotice } from '@/features/app-controller/hooks/useNotice';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { ImageMetadata, ItemData } from '@magiarium/structure';
import { FormEvent, useState } from 'react';
import { ImageUploader } from '../../../image/components/ImageUploader';
import { OGP_TEMPLATES, THUMBNAIL_TEMPLATES } from '../constants';
import { saveItemData } from '../libs/saveItemData';
import './MetadataEditor.scss';

/**
 * メタデータ編集画面 ※メタデータはアイテム種別ごとに差分ない想定のため、共通処理扱い
 */
export const MetadataEditor = ({
  itemData,
  onClose,
}: {
  itemData: ItemData;
  onClose: () => void;
}) => {
  // 入力フォーム制御用
  const [editItemData, setEditItemData] = useState<ItemData>(itemData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = <K extends keyof ItemData>(
    key: K,
    value: ItemData[K]
  ) => {
    setEditItemData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // 更新処理通知用
  const { setNotice } = useNotice();

  // 権限チェック
  const { can } = usePermission();
  if (!can('EDIT')) {
    return <>[認証エラー]対象ユーザーに編集権限がありません。</>;
  }

  return (
    <form
      className="metadata-editor__form"
      onSubmit={async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const uploadMetadataResourceResult = await saveItemData({
          editItemData: editItemData,
        });
        if (uploadMetadataResourceResult.success) {
          setNotice({
            type: 'DEFAULT',
            title: 'メタデータ編集通知',
            children: <>メタデータ保存処理に成功しました。</>,
            onClose: onClose,
          });
        } else {
          setNotice({
            type: 'DEFAULT',
            title: 'メタデータ編集通知',
            children: <>メタデータ保存処理に失敗しました。</>,
          });
        }
        setIsLoading(false);
      }}
    >
      <fieldset>
        <legend>メタデータ</legend>

        <div className="metadata-editor__field">
          <label>
            アイテムID
            <input type="text" value={editItemData.itemId} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            アイテム種別
            <input type="text" value={editItemData.itemType} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            アイテム状態
            <input type="text" value={editItemData.itemState} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            ページタイトル
            <input
              type="text"
              value={editItemData.title}
              onChange={(event) => handleChange('title', event.target.value)}
            />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            ページ説明
            <textarea
              rows={5}
              value={editItemData.description}
              onChange={(event) =>
                handleChange('description', event.target.value)
              }
            />
          </label>
        </div>

        <div className="metadata-editor__field">
          サムネイル画像
          <ImageUploader
            currentImage={editItemData.thumbnailImage}
            clipSize={{ width: 515, height: 515 }}
            onChange={(value: ImageMetadata) =>
              handleChange('thumbnailImage', value)
            }
            templates={THUMBNAIL_TEMPLATES}
          />
        </div>

        <div className="metadata-editor__field">
          OGP画像
          <ImageUploader
            currentImage={editItemData.ogpImage}
            clipSize={{ width: 1200, height: 630 }}
            onChange={(value: ImageMetadata) => handleChange('ogpImage', value)}
            templates={OGP_TEMPLATES}
          />
        </div>

        <div className="metadata-editor__field">
          <label>
            作成日時
            <input type="text" value={editItemData.createdAt} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            更新日時
            <input type="text" value={editItemData.updatedAt} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            公開日時
            <input type="text" value={editItemData.publishedAt} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            閲覧数
            <input type="number" value={editItemData.viewCount} disabled />
          </label>
        </div>

        <Button
          className="metadata-editor__submit-button"
          type="submit"
          isDisabled={isLoading}
        >
          {isLoading ? (
            <>
              保存中
              <LoadingCircle />
            </>
          ) : (
            <>保存</>
          )}
        </Button>
      </fieldset>
    </form>
  );
};

'use client';
import { Button } from '@/common/components/Button';
import { useNotice } from '@/features/app-controller/hooks/useNotice';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { ItemData } from '@magiarium/structure';
import { FormEvent, useState } from 'react';
import { ImageUploader } from '../../../image/components/ImageUploader';
import { OGP_TEMPLATES, THUMBNAIL_TEMPLATES } from '../constants';
import { fetchContentApi } from '../libs/fetchContentApi';
import './MetadataEditor.scss';

/**
 * メタデータ入力フォーム
 */
type MetadataForm = Pick<
  ItemData,
  'title' | 'description' | 'thumbnailImage' | 'ogpImage'
>;

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
  const { content: _content, ...metadata } = itemData;

  // 入力フォーム制御用
  const [form, setForm] = useState<MetadataForm>({
    title: metadata.title,
    description: metadata.description,
    thumbnailImage: metadata.thumbnailImage,
    ogpImage: metadata.ogpImage,
  });

  const handleChange = <K extends keyof MetadataForm>(
    key: K,
    value: MetadataForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // 更新処理通知用
  const { setNotice } = useNotice();

  // 権限チェック
  const { can } = usePermission();
  if (!can('EDIT')) {
    return <>認証エラー</>;
  }

  return (
    <form
      className="metadata-editor__form"
      onSubmit={async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO:ここでリソースアップロード

        // データ保存
        const result = await fetchContentApi('SaveDraftItemData', {
          params: {
            itemId: itemData.itemId,
            itemType: itemData.itemType,
          },
          body: itemData,
        });

        if (result.success) {
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
      }}
    >
      <fieldset>
        <legend>メタデータ</legend>

        <div className="metadata-editor__field">
          <label>
            アイテムID
            <input type="text" value={metadata.itemId} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            アイテム種別
            <input type="text" value={metadata.itemType} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            アイテム状態
            <input type="text" value={metadata.itemState} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            ページタイトル
            <input
              type="text"
              value={form.title}
              onChange={(event) => handleChange('title', event.target.value)}
            />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            ページ説明
            <textarea
              rows={5}
              value={form.description}
              onChange={(event) =>
                handleChange('description', event.target.value)
              }
            />
          </label>
        </div>

        <div className="metadata-editor__field">
          サムネイル画像
          <ImageUploader
            currentImage={form.thumbnailImage}
            clipSize={{ width: 515, height: 515 }}
            onChange={(value) => handleChange('thumbnailImage', value)}
            templates={THUMBNAIL_TEMPLATES}
          />
        </div>

        <div className="metadata-editor__field">
          OGP画像
          <ImageUploader
            currentImage={form.ogpImage}
            clipSize={{ width: 1200, height: 630 }}
            onChange={(value) => handleChange('ogpImage', value)}
            templates={OGP_TEMPLATES}
          />
        </div>

        <div className="metadata-editor__field">
          <label>
            作成日時
            <input type="text" value={metadata.createdAt} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            更新日時
            <input type="text" value={metadata.updatedAt} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            公開日時
            <input type="text" value={metadata.publishedAt} disabled />
          </label>
        </div>

        <div className="metadata-editor__field">
          <label>
            閲覧数
            <input type="number" value={metadata.viewCount} disabled />
          </label>
        </div>

        <Button className="metadata-editor__submit-button" type="submit">
          保存
        </Button>
      </fieldset>
    </form>
  );
};

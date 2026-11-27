import { BlogContent } from '@/features/content/blog/components/BlogItemContent';
import { WindowFrame } from '@/features/desktop/components/WindowFrame';
import { ItemId } from '@magiarium/structure';

const BlogDraftContentPage = async ({
  params,
}: {
  params: Promise<{ itemId: ItemId }>;
}) => {
  const { itemId } = await params;
  return (
    <WindowFrame
      id="blog-draft-content"
      title="ブログ"
      subTitle="個別ページ(下書き)"
      href={`/blog/${itemId}/draft`}
    >
      <BlogContent itemId={itemId} itemState="draft" />
    </WindowFrame>
  );
};

export default BlogDraftContentPage;

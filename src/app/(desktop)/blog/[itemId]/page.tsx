import { BlogContent } from '@/features/content/blog/components/BlogItemContent';
import { WindowFrame } from '@/features/desktop/components/WindowFrame';
import { ItemId } from '@magiarium/structure';

const BlogContentPage = async ({
  params,
}: {
  params: Promise<{ itemId: ItemId }>;
}) => {
  const { itemId } = await params;
  return (
    <WindowFrame
      id="blog"
      title="ブログ"
      subTitle="個別ページ"
      href={`/blog/${itemId}`}
    >
      <BlogContent itemId={itemId} itemState="public" />
    </WindowFrame>
  );
};

export default BlogContentPage;

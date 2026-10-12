import { WindowFrame } from '@/features/desktop/components/WindowFrame';

const BlogDraftContentPage = () => {
  return (
    <WindowFrame
      id="blog-draft-content"
      title="ブログ"
      subTitle="個別ページ(下書き)"
      href="/blog/001/draft"
    >
      ブログページ下書き
    </WindowFrame>
  );
};

export default BlogDraftContentPage;

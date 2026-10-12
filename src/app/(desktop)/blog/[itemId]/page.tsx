import { WindowFrame } from '@/features/desktop/components/WindowFrame';

const BlogContentPage = () => {
  return (
    <WindowFrame
      id="blog"
      title="ブログ"
      subTitle="個別ページ"
      href="/blog/001"
    >
      ブログページ
    </WindowFrame>
  );
};

export default BlogContentPage;

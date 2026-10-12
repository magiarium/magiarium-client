import { BlogList } from '@/features/category/blog/list/BlogList';
import { WindowFrame } from '@/features/desktop/components/WindowFrame';

const BlogListPage = () => {
  return (
    <WindowFrame id="blog-list" title="ブログ一覧" href="/blog">
      <BlogList />
    </WindowFrame>
  );
};

export default BlogListPage;

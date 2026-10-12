import Link from 'next/link';

export const BlogList = () => {
  return (
    <>
      ブログリスト
      <div>
        <Link href="/blog/00001">ブログ個別ページ</Link>
      </div>
      <div>
        <Link href="/blog/00001/draft">ブログ個別ページ(下書き)</Link>
      </div>
    </>
  );
};

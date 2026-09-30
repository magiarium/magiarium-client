'use client';
import { useUserAccount } from '@/features/auth/hooks/useUserAccount';
import Link from 'next/link';

const TopPage = () => {
  const { currentAccount } = useUserAccount();
  return (
    <>
      <div>トップページ</div>
      <div>現在のアカウント：{currentAccount.name}</div>
      <Link href={'/signin'}>アカウント切り替え</Link>
    </>
  );
};

export default TopPage;

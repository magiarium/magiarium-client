'use client';
import { useUserData } from '@/features/auth/hooks/useUserData';
import Link from 'next/link';

const TopPage = () => {
  const { currentAccount } = useUserData();
  return (
    <>
      <div>トップページ</div>
      <div>現在のアカウント：{currentAccount.name}</div>
      <Link href={'/signin'}>アカウント切り替え</Link>
    </>
  );
};

export default TopPage;

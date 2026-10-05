'use client';
import { AnimationOpening } from '@/features/animation/components/AnimationOpening/Main';
import { useAppState } from '@/features/app-controller/hooks/useAppState';
import { useUserData } from '@/features/auth/hooks/useUserData';
import Link from 'next/link';

const TopPage = () => {
  const { currentAccount } = useUserData();
  const { appState } = useAppState();

  if (appState === 'INITIAL') {
    // 初回時のみ、オープニングアニメーションを再生
    return <AnimationOpening />;
  }

  return (
    <>
      <div>トップページ</div>
      <div>現在のアカウント：{currentAccount.name}</div>
      <Link href={'/signin'}>アカウント切り替え</Link>
    </>
  );
};

export default TopPage;

'use client';
import { AnimationOpening } from '@/features/animation/components/AnimationOpening/Main';
import { useAppState } from '@/features/app-controller/hooks/useAppState';

const TopPage = () => {
  const { appState } = useAppState();

  return (
    <>{['INITIAL', 'RESTART'].includes(appState) && <AnimationOpening />}</>
  );
};

export default TopPage;

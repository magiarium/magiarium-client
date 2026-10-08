'use client';
import { useContext, useSyncExternalStore } from 'react';
import { SideAssistantContext } from '../contexts/SideAssistantContext';

export const useSideAsssistant = () => {
  const context = useContext(SideAssistantContext);
  if (!context) {
    throw new Error('SideAssistantContextを初期化してください。');
  }
  useSyncExternalStore(
    context.subscribe,
    context.getSnapshot,
    context.getServerSnapShot
  );

  return {
    sideAssistant: context.getSideAssistant(),
    setSpeechContent: context.setSpeechContent,
  };
};

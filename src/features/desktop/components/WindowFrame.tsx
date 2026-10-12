'use client';
import { ReactNode, useEffect } from 'react';
import { useWindowController } from '../hooks/useWindowController';
import { WindowControllerId } from '../type';

/**
 * ウィンドウフレーム
 *
 * @param params.id WindowControllerID(一意なID)
 * @param params.title タイトル
 * @param params.subTitle サブタイトル(任意)
 * @param params.children ウィンドウコンテンツ
 * @param params.href パス(任意)
 */
export const WindowFrame = ({
  id,
  title,
  subTitle,
  children,
  href,
}: {
  id: string;
  title: string;
  subTitle?: string;
  children: ReactNode;
  href?: string;
}) => {
  const { createWindowController } = useWindowController();

  // WindowControllerの作成(Managerへの登録)を実行
  useEffect(() => {
    try {
      createWindowController({
        id: id as WindowControllerId,
        title,
        subTitle,
        children,
        href,
      });
    } catch {
      // 既に登録済みなので握り潰す(ユーザー操作的には、既に存在するウィンドウを選択してアクティブ状態にした状態)
    }
  }, []);

  // WindowFrameは描画しない(WindowContextでManagerに登録したControllerをもとに、実際に必要なWindowを描画する)
  return null;
};

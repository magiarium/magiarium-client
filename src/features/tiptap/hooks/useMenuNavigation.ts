import type { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';

// 向き
type Orientation = 'horizontal' | 'vertical' | 'both';

interface MenuNavigationOptions<T> {
  /**
   * Tiptapエディターのインスタンス（任意）
   */
  editor?: Editor | null;

  /**
   * キーボードイベントを処理するコンテナ要素への参照。
   */
  containerRef?: React.RefObject<HTMLElement | null>;

  /**
   * 選択対象の項目に影響する検索クエリ。
   */
  query?: string;

  /**
   * ナビゲーション対象となる項目の配列。
   */
  items: T[];

  /**
   * 項目が選択されたときに呼び出されるコールバック関数。
   *
   * @param item - 選択された項目
   */
  onSelect?: (item: T) => void;

  /**
   * メニューを閉じる際に呼び出されるコールバック関数。
   */
  onClose?: () => void;

  /**
   * メニューのナビゲーション方向。
   *
   * @default "vertical"
   */
  orientation?: Orientation;

  /**
   * メニューを開いたときに、最初の項目を自動的に選択するかどうか。
   *
   * @default true
   */
  autoSelectFirstItem?: boolean;

  /**
   * TabキーおよびShift+Tabキーによる項目間の循環移動を有効にするかどうか。
   *
   * ARIAツールバーでは、Tabキーでツールバーの外へ移動する必要があるため、
   * このオプションを無効にする。
   *
   * @default true
   */
  loopOnTab?: boolean;
}

/**
 * ドロップダウンメニューやコマンドパレットのキーボード操作によるナビゲーションを実装するフック。
 *
 * 矢印キー、Tabキー、Homeキー、Endキー、Enterキーによる項目の選択、
 * Escapeキーによるメニューの閉じる操作を処理する。
 *
 * Tiptapエディターと通常のDOM要素の両方に対応する。
 *
 * @param options - メニューのキーボードナビゲーションに関する設定オプション
 * @returns 選択中のインデックスと、その値を更新するためのセッター関数を含むオブジェクト
 */
export function useMenuNavigation<T>({
  editor,
  containerRef,
  query,
  items,
  onSelect,
  onClose,
  orientation = 'vertical',
  autoSelectFirstItem = true,
  loopOnTab = true,
}: MenuNavigationOptions<T>) {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    autoSelectFirstItem ? 0 : -1
  );

  useEffect(() => {
    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      if (!items.length) return false;

      const moveNext = () =>
        setSelectedIndex((currentIndex) => {
          if (currentIndex === -1) return 0;
          return (currentIndex + 1) % items.length;
        });

      const movePrev = () =>
        setSelectedIndex((currentIndex) => {
          if (currentIndex === -1) return items.length - 1;
          return (currentIndex - 1 + items.length) % items.length;
        });

      switch (event.key) {
        case 'ArrowUp': {
          if (orientation === 'horizontal') return false;
          event.preventDefault();
          movePrev();
          return true;
        }

        case 'ArrowDown': {
          if (orientation === 'horizontal') return false;
          event.preventDefault();
          moveNext();
          return true;
        }

        case 'ArrowLeft': {
          if (orientation === 'vertical') return false;
          event.preventDefault();
          movePrev();
          return true;
        }

        case 'ArrowRight': {
          if (orientation === 'vertical') return false;
          event.preventDefault();
          moveNext();
          return true;
        }

        case 'Tab': {
          if (!loopOnTab) return false;
          event.preventDefault();
          if (event.shiftKey) {
            movePrev();
          } else {
            moveNext();
          }
          return true;
        }

        case 'Home': {
          event.preventDefault();
          setSelectedIndex(0);
          return true;
        }

        case 'End': {
          event.preventDefault();
          setSelectedIndex(items.length - 1);
          return true;
        }

        case 'Enter': {
          if (event.isComposing) return false;
          event.preventDefault();
          if (selectedIndex !== -1 && items[selectedIndex]) {
            onSelect?.(items[selectedIndex]);
          }
          return true;
        }

        case 'Escape': {
          if (!onClose) return false;
          event.preventDefault();
          onClose?.();
          return true;
        }

        default:
          return false;
      }
    };

    let targetElement: HTMLElement | null = null;

    if (editor) {
      targetElement = editor.view.dom;
    } else if (containerRef?.current) {
      targetElement = containerRef.current;
    }

    if (targetElement) {
      targetElement.addEventListener('keydown', handleKeyboardNavigation, true);

      return () => {
        targetElement?.removeEventListener(
          'keydown',
          handleKeyboardNavigation,
          true
        );
      };
    }

    return undefined;
  }, [
    editor,
    containerRef,
    items,
    selectedIndex,
    onSelect,
    onClose,
    orientation,
    loopOnTab,
  ]);

  useEffect(() => {
    if (query) {
      setSelectedIndex(autoSelectFirstItem ? 0 : -1);
    }
  }, [query, autoSelectFirstItem]);

  return {
    selectedIndex: items.length ? selectedIndex : undefined,
    setSelectedIndex,
  };
}

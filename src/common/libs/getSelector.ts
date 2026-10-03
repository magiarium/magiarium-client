export type Selector = string & {
  readonly __brand: 'Selector';
};

/**
 * Selector取得処理
 *
 * @param element HTMLエレメント
 * @returns 対象HTMLエレメントのSelector文字列
 */
export const getSelector = (element: HTMLElement): Selector => {
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current) {
    const tagName = current.tagName;
    let selector = tagName.toLowerCase();

    const parent: HTMLElement | null = current.parentElement;

    if (parent) {
      let sameTagCount = 0;
      let currentIndex = 0;

      for (const child of parent.children) {
        if (child.tagName === tagName) {
          sameTagCount++;

          if (child === current) {
            currentIndex = sameTagCount;
          }
        }
      }

      if (sameTagCount > 1) {
        selector += `:nth-of-type(${currentIndex})`;
      }
    }

    path.unshift(selector);

    if (tagName === 'MAIN') {
      break;
    }

    current = parent;
  }

  return path.join(' > ') as Selector;
};

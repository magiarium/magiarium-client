import { ReactNode } from 'react';

export const GRAB_CHARACTER_SIZE = { width: 300, height: 300 };
export const GRAB_POINT = {
  x: 0.66,
  y: 0.4,
};
export const SPEECH_TAIL_POSITION = { x: 30, y: 100 };
export const DEFAULT_SIDE_ASSISTANT_CHARACTER = {
  path: '/assets/images/side-assistant.png',
  alt: 'サイドアシスタント',
  width: 800,
  height: 1200,
};

export const GRAB_SIDE_ASSISTANT_CHARACTER = {
  path: '/assets/images/side-assistant_grab.png',
  alt: 'サイドアシスタント',
  width: 515,
  height: 515,
};

export const SPEECH_ASSETS: ReactNode[] = [
  <p>個人ブログですので、あしからず</p>,
  <p>みゃおう。</p>,
  <p>猫がモチーフらしいです、イルカではなく</p>,
  <p>『まぎありうむ』は、魔法の場所という意味です。</p>,
  <p>初めて触ったのはvistaでした。</p>,
  <p>スマホはiPhone派ですが、PCはWindows派です。</p>,
  <>
    <p>温泉が好きです。</p>
    <p>長湯はできませんが……</p>
  </>,
];

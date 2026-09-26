import { AdobeFontsLoader } from '@/common/components/AdobeFontsLoader';
import { ReactNode } from 'react';
import './global.scss';
import './layout.scss';

/**
 * ルートレイアウト
 */
const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="ja">
      <AdobeFontsLoader />
      <body>
        <main>
          <header>
            <h1 className="sr-only">まぎありうむ</h1>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;

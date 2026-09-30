import { AdobeFontsLoader } from '@/common/components/AdobeFontsLoader';
import { AuthExpiredNotice } from '@/features/auth/components/AuthExpiredNotice';
import { UserDataManagerContextProvider } from '@/features/auth/contexts/UserDataManagerContext';
import { getUserDataFromCookies } from '@/features/auth/libs/getUserDataFromCookies';
import { ReactNode } from 'react';
import './global.scss';
import './layout.scss';

/**
 * ルートレイアウト
 */
const RootLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  // ユーザー固有情報読み込み
  const { isAuthExpired, ...userData } = await getUserDataFromCookies();

  return (
    <html lang="ja">
      <AdobeFontsLoader />
      <body>
        <main>
          <header></header>
          <UserDataManagerContextProvider userData={userData}>
            {children}
            <AuthExpiredNotice isAuthExpired={isAuthExpired} />
          </UserDataManagerContextProvider>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;

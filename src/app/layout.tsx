import { AdobeFontsLoader } from '@/common/components/AdobeFontsLoader';
import { AnimationControllerContextProvider } from '@/features/animation/contexts/AnimationControllerContext';
import { ApplicationContextProvider } from '@/features/app-controller/contexts/ApplicationContext';
import { AuthExpiredNotice } from '@/features/auth/components/AuthExpiredNotice';
import { UserDataManagerContextProvider } from '@/features/auth/contexts/UserDataManagerContext';
import { getUserDataFromCookies } from '@/features/auth/libs/getUserDataFromCookies';
import { SideAssistantContextProvider } from '@/features/side-assistant/contexts/SideAssistantContext';
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
          <header>
            <h1 className="sr-only">まぎありうむ</h1>
          </header>
          <ApplicationContextProvider>
            <UserDataManagerContextProvider userData={userData}>
              <AnimationControllerContextProvider>
                <SideAssistantContextProvider>
                  {children}
                  <AuthExpiredNotice isAuthExpired={isAuthExpired} />
                </SideAssistantContextProvider>
              </AnimationControllerContextProvider>
            </UserDataManagerContextProvider>
          </ApplicationContextProvider>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;

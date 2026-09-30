'use client';
import { ClassicButton } from '@/common/components/ClassicButton';
import { NoticeDialog } from '@/common/components/NoticeDialog';
import { Warning } from '@react95/icons';
import { ReactNode, useRef } from 'react';
import './AuthExpiredNotice.scss';

export const AuthExpiredNotice = ({
  isAuthExpired,
}: {
  isAuthExpired: boolean;
}): ReactNode => {
  if (!isAuthExpired) {
    return null;
  }
  const noticeRef = useRef<HTMLDialogElement>(null);

  return (
    <NoticeDialog type="ALERT" ref={noticeRef} title="認証切れ">
      <div className="auth-expired-notice__content">
        <div className="auth-expired-notice__icon">
          <Warning />
        </div>
        <div>
          <p>
            アカウントのセッション有効期限が切れているため、ゲストアカウントでログインしました。
          </p>
          <p>アカウントを切り替えたい場合、再度ログインしてください。</p>
        </div>
      </div>
      <div className="auth-expired-notice__footer">
        <ClassicButton onClick={() => noticeRef.current?.close()}>
          OK
        </ClassicButton>
      </div>
    </NoticeDialog>
  );
};

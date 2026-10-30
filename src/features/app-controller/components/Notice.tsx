import { useNotice } from '@/features/app-controller/hooks/useNotice';
import { NoticeDialog } from '../../../common/components/NoticeDialog';

/**
 * Noticeコンポーネント
 */
export const Notice = () => {
  const { notice, closeNotice } = useNotice();

  if (notice === null) {
    return null;
  }

  return (
    <NoticeDialog
      type={notice.type}
      title={notice.title}
      onClose={() => {
        closeNotice();
      }}
    >
      {notice.children}
    </NoticeDialog>
  );
};

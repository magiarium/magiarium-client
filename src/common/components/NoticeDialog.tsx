'use client';
import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { BsXLg } from 'react-icons/bs';
import './NoticeDialog.scss';

type NoticeType = 'DEFAULT' | 'NOTICE' | 'ALERT';

export const NoticeDialog = forwardRef<
  HTMLDialogElement,
  {
    title: string;
    children: ReactNode;
    type?: NoticeType;
  }
>(({ title, children, type = 'DEFAULT' }, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => dialogRef.current!, []);

  useEffect(() => {
    dialogRef.current?.showModal();

    return () => {
      dialogRef.current?.close();
    };
  }, []);

  return (
    <dialog data-type={type} className="notice-dialog" ref={dialogRef}>
      <div className="notice-dialog__title-bar">
        <span className="notice-dialog__title">{title}</span>

        <button
          type="button"
          className="notice-dialog__title-button"
          onClick={() => dialogRef.current?.close()}
          aria-label="閉じる"
        >
          <BsXLg />
        </button>
      </div>

      <div className="notice-dialog__content">{children}</div>
    </dialog>
  );
});

NoticeDialog.displayName = 'NoticeDialog';

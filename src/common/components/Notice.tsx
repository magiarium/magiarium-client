'use client';
import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { BsXLg } from 'react-icons/bs';
import './Notice.scss';

type NoticeType = 'DEFAULT' | 'NOTICE' | 'ALERT';

export const Notice = forwardRef<
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
    <dialog data-type={type} className="notice" ref={dialogRef}>
      <div className="notice__title-bar">
        <span className="notice__title">{title}</span>

        <button
          type="button"
          className="notice__title-button"
          onClick={() => dialogRef.current?.close()}
          aria-label="閉じる"
        >
          <BsXLg />
        </button>
      </div>

      <div className="notice__content">{children}</div>
    </dialog>
  );
});

Notice.displayName = 'Notice';

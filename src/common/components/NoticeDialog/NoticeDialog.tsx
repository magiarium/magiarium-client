'use client';
import { NoticeConfig } from '@/features/app-controller/type';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { BsXLg } from 'react-icons/bs';
import './NoticeDialog.scss';

export const NoticeDialog = forwardRef<HTMLDialogElement, NoticeConfig>(
  ({ title, children, type = 'DEFAULT', onClose }, ref) => {
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
            onClick={() => {
              dialogRef.current?.close();
              onClose?.();
            }}
            aria-label="閉じる"
          >
            <BsXLg />
          </button>
        </div>

        <div className="notice-dialog__content">{children}</div>
      </dialog>
    );
  }
);

NoticeDialog.displayName = 'NoticeDialog';

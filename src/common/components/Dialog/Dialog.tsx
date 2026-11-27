import {
  Dialog as RadixDialog,
  DialogContent as RadixDialogContent,
  DialogOverlay as RadixDialogOverlay,
  DialogPortal as RadixDialogPortal,
  DialogTitle as RadixDialogTitle,
} from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

// Style
import './Dialog.scss';

export const Dialog = ({
  children,
  title,
  isOpen,
  onOpenChange,
}: {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <RadixDialog open={isOpen} onOpenChange={onOpenChange}>
      <RadixDialogPortal>
        <RadixDialogOverlay className="dialog__overlay" />

        <RadixDialogContent className="dialog__content">
          {title && (
            <RadixDialogTitle className="sr-only">{title}</RadixDialogTitle>
          )}
          {children}
        </RadixDialogContent>
      </RadixDialogPortal>
    </RadixDialog>
  );
};

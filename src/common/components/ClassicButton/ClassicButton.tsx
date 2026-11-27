import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import './ClassicButton.scss';

type ClassicButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const ClassicButton = forwardRef<HTMLButtonElement, ClassicButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button ref={ref} {...props} className="desktop-button">
        {children}
      </button>
    );
  }
);

import classNames from 'classnames';
import { ReactNode } from 'react';
import './Button.scss';

type PriorityType = 'PRIMARY' | 'SECONDARY';

export const Button = ({
  children,
  className,
  type = 'button',
  priority = 'PRIMARY',
  onClick,
  isDisabled,
}: {
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  priority?: PriorityType;
  onClick?: () => void;
  isDisabled?: boolean;
}) => {
  return (
    <button
      type={type}
      className={classNames(
        'standard-button',
        priority === 'PRIMARY'
          ? 'standard-button--primary'
          : 'standard-button--secondary',
        isDisabled && 'standard-button--disabled',
        className
      )}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

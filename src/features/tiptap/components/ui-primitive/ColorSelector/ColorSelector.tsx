import classNames from 'classnames';
import { forwardRef, useMemo, useRef } from 'react';
import { BsPlus } from 'react-icons/bs';
import { BanIcon } from '../../icons/BanIcon';
import { Button, ButtonProps } from '../Button';
import './ColorSelector.scss';

interface ColorButtonProps extends Omit<ButtonProps, 'type'> {
  /**
   * カラーコード
   */
  color: string;
  /**
   * ボタンクリック時アクション
   */
  handleClick: () => void;
  /**
   * アクティブ状態
   * @default false
   */
  isActive?: boolean;
  /**
   * ラベル(任意)
   */
  label?: string;
}

/**
 * カラーボタン
 */
export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
  (
    { color, isActive, label, handleClick, children, style, ...buttonProps },
    ref
  ) => {
    const buttonStyle = useMemo(
      () =>
        ({
          ...style,
          '--select-color': color,
        }) as React.CSSProperties,
      [color, style]
    );
    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? 'on' : 'off'}
        role="button"
        tabIndex={-1}
        aria-label={label || color}
        aria-pressed={isActive}
        tooltip={label || color}
        onClick={handleClick}
        style={buttonStyle}
        className={classNames('tiptap-color-selector__button')}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <span
              className="tiptap-button-color"
              style={{ '--select-color': color } as React.CSSProperties}
            />
          </>
        )}
      </Button>
    );
  }
);

/**
 * カラーボタンセレクター
 *
 * @param params.currentColor 現在のカラー
 * @param params.colorSet 選択可能カラー一覧
 * @param params.onSelect 選択時アクション
 * @param params.canCustom カスタムカラーの利用可否
 */
export const ColorSelector = ({
  currentColor,
  colorSet,
  onSelect,
  canCustom = false,
}: {
  currentColor: string | null;
  colorSet: {
    label?: string;
    color: string;
  }[];
  onSelect: (nextColor: string) => void;
  canCustom?: boolean;
}) => {
  const inputColorRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="tiptap-color-selector">
      {colorSet.map((target, index) => {
        return (
          <ColorButton
            key={`color-button-${index}`}
            color={target.color}
            handleClick={() => {
              onSelect(target.color);
            }}
            isActive={currentColor === target.color}
            label={target.label}
          />
        );
      })}
      <ColorButton
        color={''}
        handleClick={() => {
          onSelect('');
        }}
        isActive={currentColor === null}
        label={'カラー除去'}
      >
        <BanIcon className="tiptap-button-icon" />
      </ColorButton>
      {canCustom && (
        <>
          <ColorButton
            color={currentColor || ''}
            handleClick={() => {
              if (inputColorRef === null) return;
              inputColorRef.current?.click();
            }}
            isActive={
              currentColor !== null &&
              currentColor !== '' &&
              colorSet.filter((value) => value.color === currentColor)
                .length === 0
            }
            label={'カスタムカラー'}
          >
            <BsPlus className="tiptap-button-icon tiptap-button-color" />
          </ColorButton>
        </>
      )}
      <input
        ref={inputColorRef}
        type="color"
        className="hidden"
        value={currentColor || ''}
        onChange={(event) => {
          onSelect(event.target.value);
        }}
      />
    </div>
  );
};

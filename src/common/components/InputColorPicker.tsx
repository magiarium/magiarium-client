import classNames from 'classnames';
import { BsPlus } from 'react-icons/bs';
import './InputColorPicker.scss';
export type ColorCode = string;

const TEMPLATE_COLOR = {
  '#d9a9d8': 'メインカラー',
  '#ffffff': 'ホワイト',
  '#000000': 'ブラック',
};
export const ColorPicker = ({
  label,
  currentColor = '',
  onChange,
}: {
  label: string;
  currentColor?: ColorCode;
  onChange: (next: ColorCode) => void;
}) => {
  return (
    <div className="color-picker">
      <span className="color-picker__label">{label}</span>

      <div className="color-picker__palette">
        <button
          type="button"
          className={classNames(
            'color-picker__reset-button',
            currentColor === '' && 'color-picker__reset-button--active'
          )}
          onClick={() => onChange('')}
        />
        {Object.entries(TEMPLATE_COLOR).map(([colorCode, label]) => {
          return (
            <button
              type="button"
              key={`palette-color--${colorCode}`}
              className={classNames(
                'color-picker__swatch',
                colorCode === currentColor && 'color-picker__swatch--active'
              )}
              style={{ backgroundColor: colorCode }}
              aria-label={label}
              title={label}
              onClick={() => {
                onChange(colorCode);
              }}
            />
          );
        })}

        <label className="color-picker__custom" title="任意の色を選択">
          <BsPlus />
          <input
            type="color"
            value={currentColor}
            aria-label="任意の色を選択"
            onChange={(event) => {
              onChange(event.target.value);
            }}
          />
        </label>
      </div>
    </div>
  );
};

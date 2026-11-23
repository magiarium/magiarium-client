import './InputNumberWithSlider.scss';

export const InputNumberWithSlider = ({
  label,
  currentNumber,
  changeNumber,
  config = {
    min: 0.1,
    max: 3,
    step: 0.1,
  },
}: {
  label: string;
  currentNumber: number;
  changeNumber: (next: number) => void;
  config?: {
    min?: number;
    max?: number;
    step?: number;
  };
}) => {
  return (
    <div className="input-number-with-slider">
      <span className="input-number-with-slider__label">{label}</span>
      <div className="input-number-with-slider__field">
        <label title={label}>
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={currentNumber}
            onChange={(event) => changeNumber(Number(event.target.value))}
          />
        </label>
        <label title={label}>
          <input
            type="number"
            value={currentNumber}
            min={config.min}
            max={config.max}
            step={config.step}
            onChange={(event) => changeNumber(Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

import {
  Dispatch,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  SetStateAction,
  useState,
} from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import './FormInput.scss';

/**
 * form内input要素
 * @param params.id InputId
 * @param params.type InputType
 * @param params.label label + input.placeholder
 * @param params.value input.value
 * @param params.setValue input.value更新用
 * @param params.autoComplete input.autoComplete
 * @returns Reactコンポーネント
 */
export const FormInput = ({
  id,
  type,
  label,
  value,
  setValue,
  autoComplete,
}: {
  id: string;
  type: HTMLInputTypeAttribute;
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  autoComplete?: HTMLInputAutoCompleteAttribute;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="form-input">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="form-input__wrapper">
        <input
          id={id}
          type={showPassword ? 'text' : type}
          value={value}
          placeholder={label} // Markuplint #263：typeが動的な入力の場合にplaceholderを指定するとinvalid-attrが発生するが、今回は問題なし
          onChange={(e) => setValue(e.target.value)}
          autoComplete={autoComplete}
        />

        {type === 'password' && (
          <button
            type="button"
            className="form-input__password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        )}
      </div>
    </div>
  );
};

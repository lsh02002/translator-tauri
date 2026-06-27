import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const PasswordVisibleInput = ({
  disabled,
  name,
  title,
  data,
  setData,
}: {
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-100 mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {title}
      </label>
      <div className="d-flex w-100 position-relative">
        <input
          disabled={disabled}
          type={isPasswordVisible ? "text" : "password"}
          name={name}
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={`${title}을(를) 입력하세요`}
          className="form-control"
        />
        <button
          className="border-0 position-absolute"
          style={{
            top: "50%",
            right: 10,
            transform: `translateY(-50%)`,
            backgroundColor: "transparent",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
};

export default PasswordVisibleInput;

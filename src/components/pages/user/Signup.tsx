import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../../form/TextInput";
import ConfirmButton from "../../form/ConfirmButton";
import { FaRegistered } from "react-icons/fa6";
import { UserSignupType } from "../../type/Type";
import { invoke } from "@tauri-apps/api/core";
import PasswordVisibleInput from "../../form/PasswordVisibleInput";
import { showToast } from "../../form/Toast";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const OnSignupSubmit = async () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("accessToken");

    const request: UserSignupType = {
      email,
      nickname,
      password,
      password_confirm: passwordConfirm,
    };

    try {
      await invoke("register", { request });
      showToast("회원가입이 완료되었습니다.", "success");
      navigate("/login");
    } catch (e) {
      showToast("회원가입 중 오류가 발생했습니다.: " + String(e), "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100">
      <div
        className="d-flex flex-column align-items-center w-100 p-3"
        style={{ maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-between align-items-center w-100 mb-3">
          <h3 className="fw-medium mb-0">
            <FaRegistered /> 회원가입
          </h3>

          <Link
            to="/login"
            className="text-decoration-none"
            style={{ color: "#4680ff" }}
          >
            이미 계정이 있으세요?
          </Link>
        </div>

        <div className="w-100 mb-3">
          <TextInput
            name="email"
            title="이메일 주소"
            data={email}
            setData={setEmail}
          />
        </div>

        <div className="w-100 mb-3">
          <TextInput
            name="nickname"
            title="닉네임"
            data={nickname}
            setData={setNickname}
          />
        </div>

        <div className="w-100 mb-3">
          <PasswordVisibleInput
            name="password"
            title="비밀번호"
            data={password}
            setData={setPassword}
          />
        </div>

        <div className="w-100 mb-3">
          <PasswordVisibleInput
            name="passwordConfirm"
            title="비밀번호 확인"
            data={passwordConfirm}
            setData={setPasswordConfirm}
          />
        </div>

        <div className="w-100">
          <ConfirmButton title="회원 가입" onClick={OnSignupSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Signup;

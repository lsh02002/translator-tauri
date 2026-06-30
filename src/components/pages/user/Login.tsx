import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { invoke } from "@tauri-apps/api/core";
import { LoginResponseType } from "../../type/Type";
import TextInput from "../../form/input/TextInput";
import PasswordVisibleInput from "../../form/input/PasswordVisibleInput";
import ConfirmButton from "../../form/button/ConfirmButton";
import { showToast } from "../../form/toast/Toast";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLogin } = useLoginStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const OnLoginSubmit = async () => {
    const request = {
      email,
      password,
    };
    try {
      const res: LoginResponseType = await invoke("login", { request });
      localStorage.setItem("userId", res.user_id.toString());
      localStorage.setItem("nickname", res.nickname);
      localStorage.setItem("accessToken", res.token);

      setIsLogin(true);
      showToast("로그인에 성공했습니다.", "success");
      navigate("/");
    } catch (e) {
      showToast("로그인에 실패했습니다.: " + String(e), "error");
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
            <SlLogin /> 로그인
          </h3>

          <Link
            to="/signup"
            className="text-decoration-none"
            style={{ color: "#4680ff" }}
          >
            계정이 없으세요?
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
          <PasswordVisibleInput
            name="password"
            title="비밀 번호"
            data={password}
            setData={setPassword}
          />
        </div>

        <div className="w-100">
          <ConfirmButton title="로그인" onClick={OnLoginSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Login;

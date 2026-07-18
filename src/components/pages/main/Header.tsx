import { useNavigate } from "react-router-dom";
import { ModeType } from "../../type/Type";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { useCallback } from "react";

type Props = {
  mode: ModeType;
  index: number;
  totalCount: number;
};

export default function Header({ mode, index, totalCount }: Props) {
  const navigate = useNavigate();
  const { isLogin, setIsLogin } = useLoginStore();

  const modeText =
    mode === "create" ? "생성 모드" : mode === "edit" ? "수정 모드" : "진행률";

  const progressText =
    mode === "create"
      ? "NEW"
      : totalCount === 0
        ? "0 / 0"
        : `${index + 1} / ${totalCount}`;

  const handleLogout = useCallback(() => {
    if (window.confirm("로그아웃 하시겠습니까?") === false) {
      return;
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("accessToken");

    setIsLogin(false);
  }, [navigate, setIsLogin]);

  return (
    <section className="d-flex flex-column mb-4 px-4">
      <div className="w-100 d-flex justify-content-end gap-4">
        {!isLogin ? (
          <>
            <span
              className="text-primary cursor-pointer"
              role="button"
              onClick={() => navigate("/login", { replace: false })}
            >
              로그인
            </span>
            <span
              className="text-primary cursor-pointer"
              role="button"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </span>
          </>
        ) : (
          <span
            className="text-primary cursor-pointer"
            role="button"
            onClick={handleLogout}
          >
            로그아웃
          </span>
        )}
      </div>
      <div className="w-100 d-flex justify-content-between">
        <div>
          <div className="eyebrow mb-1">Tauri Translation Practice</div>

          <h1 className="mb-2">타우리 한영 번역 연습</h1>

          <div className="d-flex gap-2 align-items-center">            
            <p className="subtitle mb-0">
              한국어 문장을 영어로 옮기고,
              <br />
              예시 번역과 비교하며 표현을 다듬어 보세요.
            </p>
          </div>
        </div>
        <div className="glass-card text-center px-4 py-3">
          <span className="text-secondary d-block small">{modeText}</span>

          <strong className="fs-3">{progressText}</strong>
        </div>
      </div>
    </section>
  );
}

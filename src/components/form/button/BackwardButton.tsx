import { useNavigate, useLocation } from "react-router-dom";

export function BackwardButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const isRoot = location.pathname === "/";

  const handleClick = () => {
    if (isRoot) return;

    const from = location.state?.from;

    if (from && from === location.pathname) {
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {!isRoot && (
        <div
          className="w-100 sticky-top bg-white bg-opacity-75"
          style={{ backdropFilter: "blur(6px)", zIndex: 39 }}
        >
          <span
            role="button"
            aria-label="뒤로가기"
            onClick={handleClick}
            className="d-inline-block px-4"
            style={{
              fontSize: "32px",
              cursor: "pointer",
              pointerEvents: isRoot ? "none" : "auto",
            }}
          >
            ←
          </span>
        </div>
      )}
    </>
  );
}

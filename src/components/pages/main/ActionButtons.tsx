import { useNavigate } from "react-router-dom";

type Props = {
  mode: "view" | "create" | "edit";
  current: unknown;
  filteredLength: number;
  goPrev: () => void;
  goNext: () => void;
  startEditMode: () => void;
  startCreateMode: () => void;
};

export default function ActionButtons({
  mode,
  current,
  filteredLength,
  goPrev,
  goNext,
  startEditMode,
  startCreateMode,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between flex-wrap gap-2">
      <div className="w-100 d-flex justify-content-between">
        <div className="d-flex flex-wrap gap-2">
          {mode === "view" && (
            <>
              <button
                className="btn btn-light fw-bold"
                onClick={goPrev}
                disabled={filteredLength === 0}
              >
                이전
              </button>

              <button
                className="btn btn-light fw-bold"
                onClick={goNext}
                disabled={filteredLength === 0}
              >
                다음
              </button>

              <button
                className="btn btn-warning fw-bold"
                onClick={startEditMode}
                disabled={!current}
              >
                수정
              </button>

              <button
                className="btn btn-success fw-bold"
                onClick={startCreateMode}
              >
                새 문장 생성
              </button>
            </>
          )}
        </div>
        <div>
          <button
            className="btn btn-light fw-bold"
            onClick={() => navigate("/sentences/list")}
          >
            전체 목록 보기
          </button>
        </div>
      </div>
    </div>
  );
}

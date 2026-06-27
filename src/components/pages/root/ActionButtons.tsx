type Props = {
  mode: "view" | "create" | "edit";
  current: unknown;
  filteredLength: number;
  goPrev: () => void;
  goNext: () => void;
  startEditMode: () => void;
  startCreateMode: () => void;
  createPracticeText: () => void;
  updatePracticeText: () => void;
  cancelWriteMode: () => void;
};

export default function ActionButtons({
  mode,
  current,
  filteredLength,
  goPrev,
  goNext,
  startEditMode,
  startCreateMode,
  createPracticeText,
  updatePracticeText,
  cancelWriteMode,
}: Props) {
  return (
    <div className="d-flex justify-content-between flex-wrap gap-2">
      <div className="d-flex flex-wrap gap-2 mt-4">
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

        {mode === "create" && (
          <>
            <button
              className="btn btn-success fw-bold"
              onClick={createPracticeText}
            >
              생성 저장
            </button>

            <button className="btn btn-light fw-bold" onClick={cancelWriteMode}>
              취소
            </button>
          </>
        )}

        {mode === "edit" && (
          <>
            <button
              className="btn btn-warning fw-bold"
              onClick={updatePracticeText}
            >
              수정 저장
            </button>

            <button className="btn btn-light fw-bold" onClick={cancelWriteMode}>
              취소
            </button>
          </>
        )}
      </div>
    </div>
  );
}

import { DifficultyType, ModeType } from "../../type/Type";

type Props = {
  mode: ModeType;
  difficulty: DifficultyType;
  sourceLanguageType: "ko-KR" | "en-US";
  filteredLength: number;
  setDifficulty: (value: DifficultyType) => void;
  setSourceLanguageType: (value: "ko-KR" | "en-US") => void;
  setIndex: (index: number) => void;
  shuffleSentence: () => void;
};

export default function FilterBar({
  mode,
  difficulty,
  sourceLanguageType,
  filteredLength,
  setDifficulty,
  setSourceLanguageType,
  setIndex,
  shuffleSentence,
}: Props) {
  return (
    <section className="glass-card px-4">
      <div className="d-flex gap-3 align-items-end">
        <div>
          <label className="form-label fw-bold text-secondary">난이도</label>

          <select
            className="form-select"
            value={difficulty}            
            onChange={(e) => {
              setDifficulty(e.target.value as DifficultyType);

              if (mode === "view") {
                setIndex(0);
              }
            }}
          >
            <option value="전부">전부</option>
            <option value="쉬움">쉬움</option>
            <option value="보통">보통</option>
            <option value="어려움">어려움</option>
          </select>
        </div>

        <div>
          <label className="form-label fw-bold text-secondary">모드</label>

          <select
            className="form-select"
            value={sourceLanguageType}
            disabled={mode === "view"}
            onChange={(e) =>
              setSourceLanguageType(e.target.value as "ko-KR" | "en-US")
            }
          >
            <option value="ko-KR">한국어 → 영어</option>
            <option value="en-US">영어 → 한국어</option>
          </select>
        </div>

        <div className="flex-grow-1">
          <button
            className="btn btn-light fw-bold w-100"
            onClick={shuffleSentence}
            disabled={mode !== "view" || filteredLength === 0}
          >
            문장 섞기
          </button>
        </div>
      </div>
    </section>
  );
}

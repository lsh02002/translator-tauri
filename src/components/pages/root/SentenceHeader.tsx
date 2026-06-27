import { ModeType } from "../../type/Type";

type Props = {
  mode: ModeType;
  difficulty?: string;
  sourceLanguage: string;
  speakSentence: () => void;
};

export default function SentenceHeader({
  mode,
  difficulty,
  sourceLanguage,
  speakSentence,
}: Props) {
  const badgeText =
    mode === "create"
      ? "새 문장"
      : mode === "edit"
        ? "수정 중"
        : (difficulty ?? "문장 없음");

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="badge rounded-pill text-primary bg-primary-subtle px-3 py-2">
        {badgeText}
      </span>

      <button
        className="btn btn-primary icon-btn"
        title="문장 읽기"
        onClick={speakSentence}
        disabled={!sourceLanguage.trim()}
      >
        🔊
      </button>
    </div>
  );
}

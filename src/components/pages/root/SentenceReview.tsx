import { TipsType } from "../../type/Type";

type Props = {
  mode: "view" | "create" | "edit";
  sampleTranslation?: string | null;
  tips: TipsType | null;
};

export default function SentenceReview({
  mode,
  sampleTranslation,
  tips,
}: Props) {
  if (mode !== "view") return null;

  return (
    <div className="mt-4 pt-3 border-top">
      <h2 className="fs-6 text-secondary">예시 번역</h2>
      <p className="fs-5 fw-bold">{sampleTranslation}</p>

      <h2 className="fs-6 text-secondary mt-3">번역 리뷰</h2>

      {tips ? (
        <ul>
          <li>정답 여부: {tips.is_correct ? "정답" : "오답"}</li>
          <li>점수: {tips.score}</li>
          <li>리뷰 평가: {tips.review}</li>
        </ul>
      ) : (
        <p className="text-secondary mb-0">표시할 번역 리뷰가 없습니다.</p>
      )}
    </div>
  );
}

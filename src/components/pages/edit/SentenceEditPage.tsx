import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { DifficultyType, SentenceType } from "../../type/Type";
import { showToast } from "../../form/toast/Toast";

export default function SentenceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sourceLanguageType, setSourceLanguageType] = useState<
    "ko-KR" | "en-US"
  >("ko-KR");

  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [sampleTranslation, setSampleTranslation] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyType>("전부");
  const [tips, setTips] = useState<{
    is_correct: boolean;
    score: number;
    review: string;
  } | null>(null);

  const fetchSentence = async () => {
    if (!id) return;

    try {
      const token = localStorage.getItem("accessToken");

      const result = await invoke<SentenceType>("get_practice_text", {
        token,
        id: Number(id),
      });

      setSourceLanguage(result.source_language);
      setTargetLanguage(result.target_language);
      setSourceLanguageType(
        result.source_language_type === "en-US" ? "en-US" : "ko-KR",
      );
      setSampleTranslation(result.sample_translation ?? "");
      setDifficulty(result.difficulty ?? "전부");
      setTips(JSON.parse(result.tips) ?? null);      
    } catch (e) {
      showToast("문장 정보를 불러오는 데 실패했습니다.: " + String(e), "error");
    }
  };

  useEffect(() => {
    fetchSentence();
  }, [id]);

  const updatePracticeText = async () => {
    if (!id) {
      showToast("수정할 문장 ID가 없습니다.", "error");
      return;
    }

    if (!sourceLanguage.trim()) {
      showToast("원문 문장이 비어있습니다.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await invoke("update_practice_text", {
        token,
        id: Number(id),
        request: {
          source_language_type: sourceLanguageType,
          source_language: sourceLanguage.trim(),
          target_language: targetLanguage.trim(),
        },
      });

      fetchSentence();
      showToast("연습 문장이 수정되었습니다.", "success");
    } catch (e) {
      showToast("연습 문장 수정에 실패했습니다.: " + String(e), "error");
    }
  };

  return (
    <main className="app">
      <section className="glass-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">연습 문장 수정</h2>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-bold">모드</label>
            <select
              className="form-select"
              value={sourceLanguageType}
              onChange={(e) =>
                setSourceLanguageType(e.target.value as "ko-KR" | "en-US")
              }
            >
              <option value="ko-KR">한국어 → 영어</option>
              <option value="en-US">영어 → 한국어</option>
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3 gap-2">
          <div className="w-100">
            <label className="form-label fw-bold">원문 문장</label>

            <textarea
              className="form-control"
              placeholder="여기에 원문 문장을 입력하세요..."
              rows={4}
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            />
          </div>

          <div className="w-100">
            <label className="form-label fw-bold">내가 연습한 번역</label>

            <textarea
              className="form-control"
              placeholder="여기에 번역을 입력하세요..."
              rows={4}
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-top">
          <h2 className="fs-6 text-secondary">예시 번역</h2>
          <p className="fs-5 fw-bold">{sampleTranslation}</p>

          <h2 className="fs-6 text-secondary mt-3">번역 리뷰</h2>

          {tips ? (
            <ul>
              <li>정답 여부: {tips.is_correct ? "정답" : "오답"}</li>
              <li>점수: {tips.score}</li>
              <li>난이도: {difficulty}</li>
              <li>리뷰 평가: {tips.review}</li>
            </ul>
          ) : (
            <p className="text-secondary mb-0">표시할 번역 리뷰가 없습니다.</p>
          )}
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={updatePracticeText}
          >
            수정
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </section>
    </main>
  );
}

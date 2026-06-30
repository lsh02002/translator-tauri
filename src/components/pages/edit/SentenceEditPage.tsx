import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { SentenceType } from "../../type/Type";
import { showToast } from "../../form/Toast";

export default function SentenceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sourceLanguageType, setSourceLanguageType] = useState<
    "ko-KR" | "en-US"
  >("ko-KR");

  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  useEffect(() => {
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
      } catch (e) {
        showToast(
          "문장 정보를 불러오는 데 실패했습니다.: " + String(e),
          "error",
        );
      }
    };

    fetchSentence();
  }, [id]);

  const updatePracticeText = async () => {
    if (!id) {
      alert("수정할 문장 ID가 없습니다.");
      return;
    }

    if (!sourceLanguage.trim()) {
      alert("원문 문장이 비어있습니다.");
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

      showToast("연습 문장이 수정되었습니다.", "success");
      navigate(-1);
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
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            />
          </div>

          <div className="w-100">
            <label className="form-label fw-bold">내가 연습한 번역</label>

            <textarea
              className="form-control"
              placeholder="여기에 번역을 입력하세요..."
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            />
          </div>
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

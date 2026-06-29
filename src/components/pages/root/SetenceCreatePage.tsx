import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import SentenceEditor from "./SentenceEditor";
import { showToast } from "../../form/Toast";

export default function SentenceCreatePage() {
  const navigate = useNavigate();

  const [sourceLanguageType, setSourceLanguageType] = useState<
    "ko-KR" | "en-US"
  >("ko-KR");

  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const createPracticeText = async () => {
    if (!sourceLanguage.trim()) {
      alert("원문 문장이 비어있습니다.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await invoke("create_practice_text", {
        token,
        request: {
          domain_category_id: null,
          source_language_type: sourceLanguageType,
          source_language: sourceLanguage.trim(),
          target_language: targetLanguage.trim(),
        },
      });

      showToast("연습 문장이 생성되었습니다.", "success");
      navigate(-1);
    } catch (e) {
      showToast("연습 문장 생성에 실패했습니다.: " + String(e), "error");
    }
  };

  return (
    <main className="app">
      <section className="glass-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">연습 문장 생성</h2>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">모드</label>
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

        <SentenceEditor
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          isWritable={true}
          setSourceLanguage={setSourceLanguage}
          setTargetLanguage={setTargetLanguage}
        />

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={createPracticeText}
          >
            생성
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

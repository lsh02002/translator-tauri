import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { showToast } from "../../form/toast/Toast";
import { CategoryType } from "../../type/Type";
import { useLoginStore } from "../../zustand/ZustandLogin";

export default function SentenceCreatePage() {
  const navigate = useNavigate();
  const { categoryName, setCategoryName } = useLoginStore();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [sourceLanguageType, setSourceLanguageType] = useState<
    "ko-KR" | "en-US"
  >("ko-KR");

  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const result = await invoke<CategoryType[]>("get_domain_categories", {
          token,
        });

        setCategories(result);
      } catch (e) {
        showToast(
          "카테고리 데이터를 불러오는 데 실패했습니다.: " + String(e),
          "error",
        );
      }
    })();
  }, []);

  const createPracticeText = async () => {
    if (!sourceLanguage.trim()) {
      showToast("원문 문장이 비어있습니다.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const domainCategoryId =
        categories.find((category) => category.name === categoryName)?.id ??
        null;

      await invoke("create_practice_text", {
        token,
        request: {
          domain_category_id: domainCategoryId,
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
            <label className="form-label">카테고리</label>
            <select
              className="form-select"
              value={categoryName || ""}
              onChange={(e) => setCategoryName(String(e.target.value))}
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
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

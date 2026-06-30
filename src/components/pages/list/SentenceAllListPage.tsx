import { ReactNode, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

import { DifficultyType, SentenceType } from "../../type/Type";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { showToast } from "../../form/Toast";

export default function SentenceAllListPage() {
  const navigate = useNavigate();
  const { isLogin } = useLoginStore();

  const [sentences, setSentences] = useState<SentenceType[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyType>("전부");
  const [keyword, setKeyword] = useState("");

  const fetchSentences = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const result = await invoke<SentenceType[]>("get_practice_texts", {
        token,
      });

      setSentences(result);
    } catch (e) {
      showToast(
        "문장 데이터를 불러오는 데 실패했습니다.: " + String(e),
        "error",
      );
    }
  };

  useEffect(() => {
    if (!isLogin) {
      setSentences([]);
      return;
    }

    fetchSentences();
  }, [isLogin]);

  const filteredSentences = useMemo(() => {
    return sentences.filter((sentence) => {
      const matchDifficulty =
        difficulty === "전부" || sentence.difficulty === difficulty;

      const lowerKeyword = keyword.trim().toLowerCase();

      const matchKeyword =
        !lowerKeyword ||
        sentence.source_language.toLowerCase().includes(lowerKeyword) ||
        sentence.target_language.toLowerCase().includes(lowerKeyword) ||
        sentence.sample_translation?.toLowerCase().includes(lowerKeyword) ||
        sentence.tips?.toLowerCase().includes(lowerKeyword);

      return matchDifficulty && matchKeyword;
    });
  }, [sentences, difficulty, keyword]);

  function highlightText(text: string, query: string): ReactNode {
    const trimmed = query.trim();

    if (!trimmed) {
      return text;
    }

    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`(${escaped})`, "gi");

    return text
      .split(regex)
      .map((part, index) =>
        regex.test(part) ? <mark key={index}>{part}</mark> : part,
      );
  }

  return (
    <main className="container py-4">
      <section className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h4 mb-1">등록된 학습 내용</h1>
              <small className="text-muted">
                총 {filteredSentences.length}개 / 전체 {sentences.length}개
              </small>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/sentences/create")}
            >
              새 문장 등록
            </button>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-md-3">
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as DifficultyType)
                }
              >
                <option value="전부">전부</option>
                <option value="쉬움">쉬움</option>
                <option value="보통">보통</option>
                <option value="어려움">어려움</option>
              </select>
            </div>

            <div className="col-md-9">
              <input
                className="form-control"
                placeholder="원문, 번역, AI 번역, 점수, 리뷰 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          {filteredSentences.length === 0 ? (
            <div className="text-center py-5 text-muted">
              등록된 학습 내용이 없습니다.
            </div>
          ) : (
            filteredSentences.map((sentence: SentenceType) => {
              let tips = null;

              try {
                tips = sentence.tips ? JSON.parse(sentence.tips) : null;
              } catch {
                tips = null;
              }

              return (
                <div key={sentence.id} className="card mb-4 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="badge bg-primary me-2">
                          #{sentence.id}
                        </span>

                        <span className="badge bg-secondary me-2">
                          {sentence.difficulty}
                        </span>

                        <span className="badge bg-info text-dark">
                          {sentence.source_language_type}
                        </span>
                      </div>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navigate(`/sentences/${sentence.id}/edit`)
                        }
                      >
                        수정
                      </button>
                    </div>

                    <div className="w-100 d-flex justify-content-between gap-3">
                      <div className="w-100 mb-3">
                        <h6 className="fw-bold">원문</h6>

                        <div className="border rounded p-3 h-100">
                          {highlightText(sentence.source_language, keyword)}
                        </div>
                      </div>

                      <div className="w-100 mb-3">
                        <h6 className="fw-bold">내 번역</h6>

                        <div className="border rounded p-3 h-100">
                          {highlightText(sentence.target_language, keyword)}
                        </div>
                      </div>

                      <div className="w-100 mb-3">
                        <h6 className="fw-bold">AI 답안 번역</h6>

                        <div className="border rounded p-3 h-100">
                          {highlightText(
                            sentence.sample_translation || "없음",
                            keyword,
                          )}
                        </div>
                      </div>
                    </div>

                    <h5 className="mt-4">번역 리뷰</h5>

                    {tips ? (
                      <div className="row">
                        <div className="col-md-2 mb-2">
                          <strong>정답 여부</strong>
                          <div>
                            {tips.is_correct ? (
                              <span className="badge bg-success">정답</span>
                            ) : (
                              <span className="badge bg-danger">오답</span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-2 mb-2">
                          <strong>점수</strong>
                          <div>
                            {highlightText(String(tips.score), keyword)}점
                          </div>
                        </div>

                        <div className="col-md-8 mb-2">
                          <strong>리뷰</strong>
                          <div>{highlightText(tips.review, keyword)}</div>
                        </div>

                        {tips.improvements &&
                          Array.isArray(tips.improvements) &&
                          tips.improvements.length > 0 && (
                            <div className="col-12 mt-3">
                              <strong>개선 사항</strong>

                              <ul className="mt-2 mb-0">
                                {tips.improvements.map(
                                  (item: string, idx: number) => (
                                    <li key={idx}>
                                      {highlightText(item, keyword)}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="alert alert-secondary mb-0">
                        표시할 번역 리뷰가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

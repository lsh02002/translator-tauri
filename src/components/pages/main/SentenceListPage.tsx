import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

import { DifficultyType, ModeType, SentenceType } from "../../type/Type";
import ActionButtons from "./ActionButtons";
import FilterBar from "./FilterBar";
import Header from "./Header";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { showToast } from "../../form/Toast";

export default function SentenceListPage() {
  const navigate = useNavigate();
  const { isLogin } = useLoginStore();

  const mode: ModeType = "view";

  const [sourceLanguageType, setSourceLanguageType] = useState<
    "ko-KR" | "en-US"
  >("ko-KR");

  const [index, setIndex] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyType>("전부");

  const [sentences, setSentences] = useState<SentenceType[]>([]);

  const fetchSentences = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const result = await invoke<SentenceType[]>("get_practice_texts", {
        token,
      });

      setSentences(result);
      console.log("문장 데이터를 성공적으로 불러왔습니다.", result);
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

  const filteredSources = useMemo(() => {
    return difficulty === "전부"
      ? sentences
      : sentences.filter((sentence) => sentence.difficulty === difficulty);
  }, [difficulty, sentences]);

  const current = filteredSources[index] ?? null;

  useEffect(() => {
    if (filteredSources.length) {
      setIndex(filteredSources.length - 1);
    }
  }, [filteredSources.length]);

  const tips = useMemo(() => {
    try {
      return current?.tips ? JSON.parse(current.tips) : null;
    } catch {
      return null;
    }
  }, [current]);

  useEffect(() => {
    setSourceLanguage(current?.source_language ?? "");
    setTargetLanguage(current?.target_language ?? "");
    setSourceLanguageType(
      current?.source_language_type === "en-US" ? "en-US" : "ko-KR",
    );
  }, [current]);

  const goNext = () => {
    if (filteredSources.length === 0) return;
    setIndex((prev) => (prev + 1) % filteredSources.length);
  };

  const goPrev = () => {
    if (filteredSources.length === 0) return;
    setIndex((prev) => (prev === 0 ? filteredSources.length - 1 : prev - 1));
  };

  const shuffleSentence = () => {
    if (filteredSources.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredSources.length);
    setIndex(randomIndex);
  };

  const speakSentence = () => {
    if (!sourceLanguage.trim()) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(sourceLanguage);
    const voices = synth.getVoices();

    utterance.voice =
      sourceLanguageType === "ko-KR"
        ? (voices.find((v) => v.lang === "ko-KR") ?? null)
        : (voices.find((v) => v.lang.startsWith("en")) ?? null);

    utterance.lang = sourceLanguageType;
    utterance.rate = 1;

    setTimeout(() => {
      synth.speak(utterance);
    }, 200);
  };

  const startCreateMode = () => {
    navigate("/sentences/create");
  };

  const startEditMode = () => {
    if (!current) return;
    navigate(`/sentences/${current.id}/edit`);
  };

  const badgeText = difficulty ?? "문장 없음";

  return (
    <main className="app">
      <Header mode={mode} index={index} totalCount={filteredSources.length} />

      <FilterBar
        mode={mode}
        difficulty={difficulty}
        sourceLanguageType={sourceLanguageType}
        filteredLength={filteredSources.length}
        setDifficulty={setDifficulty}
        setSourceLanguageType={setSourceLanguageType}
        setIndex={setIndex}
        shuffleSentence={shuffleSentence}
      />

      <section className="glass-card p-4">
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

        <div className="d-flex justify-content-between mt-3 gap-2">
          <div className="w-100">
            <label className="form-label fw-bold">원문 문장</label>

            <textarea
              className="form-control"
              placeholder="여기에 원문 문장을 입력하세요..."
              value={sourceLanguage}
              readOnly={true}
              onChange={(e) => setSourceLanguage(e.target.value)}
            />
          </div>

          <div className="w-100">
            <label className="form-label fw-bold">내가 연습한 번역</label>

            <textarea
              className="form-control"
              placeholder="여기에 번역을 입력하세요..."
              value={targetLanguage}
              readOnly={true}
              onChange={(e) => setTargetLanguage(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-top">
          <h2 className="fs-6 text-secondary">예시 번역</h2>
          <p className="fs-5 fw-bold">{current?.sample_translation}</p>

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

        <ActionButtons
          mode={mode}
          current={current}
          filteredLength={filteredSources.length}
          goPrev={goPrev}
          goNext={goNext}
          startEditMode={startEditMode}
          startCreateMode={startCreateMode}
        />
      </section>
    </main>
  );
}

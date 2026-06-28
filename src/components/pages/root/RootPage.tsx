import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

import { DifficultyType, ModeType, SentenceType } from "../../type/Type";
import ActionButtons from "./ActionButtons";
import SentenceReview from "./SentenceReview";
import SentenceEditor from "./SentenceEditor";
import FilterBar from "./FilterBar";
import Header from "./Header";
import SentenceHeader from "./SentenceHeader";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { showToast } from "../../form/Toast";

export default function RootPage() {
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
    if (filteredSources.length === 0) {
      setIndex(0);
      return;
    }

    if (index >= filteredSources.length) {
      setIndex(filteredSources.length - 1);
    }
  }, [filteredSources.length, index]);

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
        <SentenceHeader
          mode={mode}
          difficulty={current?.difficulty}
          sourceLanguage={sourceLanguage}
          speakSentence={speakSentence}
        />

        <SentenceEditor
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          isWritable={false}
          setSourceLanguage={setSourceLanguage}
          setTargetLanguage={setTargetLanguage}
        />

        <SentenceReview
          mode={mode}
          sampleTranslation={current?.sample_translation}
          tips={tips}
        />

        <ActionButtons
          mode={mode}
          current={current}
          filteredLength={filteredSources.length}
          goPrev={goPrev}
          goNext={goNext}
          startEditMode={startEditMode}
          startCreateMode={startCreateMode}
          createPracticeText={() => {}}
          updatePracticeText={() => {}}
          cancelWriteMode={() => {}}
        />
      </section>
    </main>
  );
}

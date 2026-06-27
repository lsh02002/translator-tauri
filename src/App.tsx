import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { invoke } from "@tauri-apps/api/core";
import { DifficultyType, ModeType, SentenceType } from "./components/type/Type";
import ActionButtons from "./components/ActionButtons";
import SentenceReview from "./components/SentenceReview";
import SentenceEditor from "./components/SentenceEditor";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import SentenceHeader from "./components/SentenceHeader";

export default function App() {
  const [mode, setMode] = useState<ModeType>("view");

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
      const result = await invoke<SentenceType[]>("get_practice_texts");
      setSentences(result);
      console.log("문장 데이터를 성공적으로 불러왔습니다.", result);
    } catch (error) {
      console.error("문장 데이터를 불러오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchSentences();
  }, []);

  const filteredSources = useMemo(() => {
    return difficulty === "전부"
      ? sentences
      : sentences.filter((sentence) => sentence.difficulty === difficulty);
  }, [difficulty, sentences]);

  const current = filteredSources[index] ?? null;

  const tips = useMemo(() => {
    try {
      return current?.tips ? JSON.parse(current.tips) : null;
    } catch {
      return null;
    }
  }, [current]);

  useEffect(() => {
    if (mode !== "view") return;

    setSourceLanguage(current?.source_language ?? "");
    setTargetLanguage(current?.target_language ?? "");
    setSourceLanguageType(
      current?.source_language_type === "en-US" ? "en-US" : "ko-KR",
    );
  }, [current, mode]);

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
    setMode("create");
    setSourceLanguage("");
    setTargetLanguage("");
    setDifficulty("전부");
    setSourceLanguageType("ko-KR");
  };

  const startEditMode = () => {
    if (!current) return;

    setMode("edit");
    setSourceLanguage(current.source_language);
    setTargetLanguage(current.target_language);
    setDifficulty(current.difficulty);
    setSourceLanguageType(
      current.source_language_type === "en-US" ? "en-US" : "ko-KR",
    );
  };

  const cancelWriteMode = () => {
    setMode("view");

    setSourceLanguage(current?.source_language ?? "");
    setTargetLanguage(current?.target_language ?? "");
    setDifficulty(current?.difficulty ?? "쉬움");
    setSourceLanguageType(
      current?.source_language_type === "en-US" ? "en-US" : "ko-KR",
    );
  };

  const createPracticeText = async () => {
    if (sourceLanguage.trim() === "") {
      alert("원문 문장이 비어있습니다.");
      return;
    }

    try {
      const newPracticeText = {
        domain_category_id: null,
        source_language_type: sourceLanguageType,
        source_language: sourceLanguage.trim(),
        target_language: targetLanguage.trim(),
        difficulty,
      };

      await invoke("create_practice_text", { request: newPracticeText });

      await fetchSentences();

      setMode("view");
      setIndex(0);

      alert("연습 문장이 생성되었습니다.");
    } catch (error) {
      console.error("연습 문장 생성에 실패했습니다.", error);
      alert("연습 문장 생성에 실패했습니다.");
    }
  };

  const updatePracticeText = async () => {
    if (!current) {
      alert("수정할 문장이 없습니다.");
      return;
    }

    if (sourceLanguage.trim() === "") {
      alert("원문 문장이 비어있습니다.");
      return;
    }

    try {
      const updateRequest = {
        source_language_type: sourceLanguageType,
        source_language: sourceLanguage.trim(),
        target_language: targetLanguage.trim(),
        difficulty,
      };

      await invoke("update_practice_text", {
        id: current.id,
        request: updateRequest,
      });

      await fetchSentences();

      setMode("view");

      alert("연습 문장이 수정되었습니다.");
    } catch (error) {
      console.error("연습 문장 수정에 실패했습니다.", error);
      alert("연습 문장 수정에 실패했습니다.");
    }
  };

  const isWritable = mode === "create" || mode === "edit";

  return (
    <main className="app">
      <Header mode={mode} index={index} totalCount={filteredSources?.length ?? 0} />

      <FilterBar
        mode={mode}
        difficulty={difficulty}
        sourceLanguageType={sourceLanguageType}
        filteredLength={filteredSources?.length}
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
          isWritable={isWritable}
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
          filteredLength={filteredSources?.length}
          goPrev={goPrev}
          goNext={goNext}
          startEditMode={startEditMode}
          startCreateMode={startCreateMode}
          createPracticeText={createPracticeText}
          updatePracticeText={updatePracticeText}
          cancelWriteMode={cancelWriteMode}
        />
      </section>
    </main>
  );
}

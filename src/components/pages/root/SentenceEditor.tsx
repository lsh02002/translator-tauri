type Props = {
  sourceLanguage: string;
  targetLanguage: string;
  isWritable: boolean;
  setSourceLanguage: (value: string) => void;
  setTargetLanguage: (value: string) => void;
};

export default function SentenceEditor({
  sourceLanguage,
  targetLanguage,
  isWritable,
  setSourceLanguage,
  setTargetLanguage,
}: Props) {
  return (
    <div className="d-flex justify-content-between mt-3 gap-2">
      <div className="w-100">
        <label className="form-label fw-bold">원문 문장</label>

        <textarea
          className="form-control"
          placeholder="여기에 원문 문장을 입력하세요..."
          value={sourceLanguage}
          readOnly={!isWritable}
          onChange={(e) => setSourceLanguage(e.target.value)}
        />
      </div>

      <div className="w-100">
        <label className="form-label fw-bold">내가 연습한 번역</label>

        <textarea
          className="form-control"
          placeholder="여기에 번역을 입력하세요..."
          value={targetLanguage}
          readOnly={!isWritable}
          onChange={(e) => setTargetLanguage(e.target.value)}
        />
      </div>
    </div>
  );
}

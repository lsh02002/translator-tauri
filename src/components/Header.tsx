import { ModeType } from "./type/Type";

type Props = {
  mode: ModeType;
  index: number;
  totalCount: number;
};

export default function Header({ mode, index, totalCount }: Props) {
  const modeText =
    mode === "create" ? "생성 모드" : mode === "edit" ? "수정 모드" : "진행률";

  const progressText =
    mode === "create"
      ? "NEW"
      : totalCount === 0
        ? "0 / 0"
        : `${index + 1} / ${totalCount}`;

  return (
    <section className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-4 px-4 pt-4">
      <div>
        <p className="eyebrow mb-1">Tauri Translation Practice</p>

        <h1 className="mb-2">타우리 한영 번역 연습</h1>

        <p className="subtitle mb-0">
          한국어 문장을 영어로 옮기고,
          <br />
          예시 번역과 비교하며 표현을 다듬어 보세요.
        </p>
      </div>

      <div className="glass-card text-center px-4 py-3">
        <span className="text-secondary d-block small">{modeText}</span>

        <strong className="fs-3">{progressText}</strong>
      </div>
    </section>
  );
}

export type DifficultyType = "전부" | "쉬움" | "보통" | "어려움";
export type ModeType = "view" | "create" | "edit";

export type SentenceType = {
  id: number;
  domain_category_id: number | null;
  source_language_type: string;
  source_language: string;
  target_language: string;
  difficulty: DifficultyType;
  sample_translation: string | null;
  tips: string;
  created_at: string;
};

export type TipsType = {
  is_correct: boolean;
  score: number;
  review: string;
};

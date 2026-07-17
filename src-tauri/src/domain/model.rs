use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: i64,
    pub email: String,
    pub nickname: String,
    pub password: String,
    pub role: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct DomainCategory {
    pub id: i64,
    pub user_id: i64,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct PracticeText {
    pub id: i64,
    pub user_id: i64,
    pub domain_category_id: Option<i64>,
    pub domain_category_name: Option<String>,
    pub source_language_type: String,
    pub source_language: String,
    pub target_language: String,
    pub difficulty: Option<String>,
    pub sample_translation: Option<String>,
    pub tips: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReviewResult {
    pub translation: String,
    pub is_correct: bool,
    pub score: i64,
    pub review: String,
    pub corrected_answer: String,
    pub difficulty: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Term {
    pub id: i64,
    pub domain_category_name: Option<String>,
    pub source_term: String,
    pub target_term: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct TermNote {
    pub id: i64,
    pub user_id: i64,
    pub term_id: i64,
    pub memo: Option<String>,
    pub memorized: bool,
    pub created_at: String,
}

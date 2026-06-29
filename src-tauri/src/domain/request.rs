use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub email: String,
    pub nickname: String,
    pub password: String,
    pub password_confirm: String,
    pub role: Option<String>,
}
#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user_id: i64,
    pub email: String,
    pub nickname: String,
    pub role: String,
}

#[derive(Debug, Deserialize)]
pub struct CreatePracticeTextRequest {
    pub domain_category_id: Option<i64>,    
    pub source_language_type: String,
    pub source_language: String,
    pub target_language: String,
    pub difficulty: Option<String>,
    pub sample_translation: Option<String>,
    pub tips: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTermRequest {
    pub domain_category_id: i64,
    pub source_term: String,
    pub target_term: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTermNoteRequest {
    pub user_id: i64,
    pub term_id: i64,
    pub memo: Option<String>,
}

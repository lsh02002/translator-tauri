use sqlx::SqlitePool;
use crate::{domain::{model::TermNote, request::{CreateTermRequest, CreateTermNoteRequest}}, repository::term_repository};

pub async fn create_term(db: &SqlitePool, request: CreateTermRequest) -> Result<(), String> {
    if request.source_term.trim().is_empty() || request.target_term.trim().is_empty() {
        return Err("source_term and target_term are required".to_string());
    }

    term_repository::create_term(db, request).await.map_err(|e| e.to_string())
}

pub async fn create_term_note(db: &SqlitePool, user_id: i64, request: CreateTermNoteRequest) -> Result<(), String> {
    term_repository::create_term_note(db, user_id, request).await.map_err(|e| e.to_string())
}

pub async fn update_term(db: &SqlitePool, id: i64, request: CreateTermRequest) -> Result<(), String> {
    if request.source_term.trim().is_empty() || request.target_term.trim().is_empty() {
        return Err("source_term and target_term are required".to_string());
    }

    term_repository::update_term(db, id, request).await.map_err(|e| e.to_string())
}

pub async fn update_term_note(db: &SqlitePool, id: i64, user_id: i64, request: CreateTermNoteRequest) -> Result<(), String> {
    term_repository::update_term_note(db, id, user_id, request).await.map_err(|e| e.to_string())
}

pub async fn get_term_notes(db: &SqlitePool, user_id: i64) -> Result<Vec<TermNote>, String> {
    term_repository::find_all_term_notes(db, user_id).await.map_err(|e| e.to_string())
}

pub async fn get_term_note_by_id(db: &SqlitePool, id: i64, user_id: i64) -> Result<TermNote, String> {
    term_repository::find_term_note_by_id(db, id, user_id).await.map_err(|e| e.to_string())
}

pub async fn delete_term(db: &SqlitePool, id: i64) -> Result<(), String> {
    term_repository::delete_term(db, id).await.map_err(|e| e.to_string())
}

pub async fn delete_term_note(db: &SqlitePool, id: i64, user_id: i64) -> Result<(), String> {
    term_repository::delete_term_note(db, id, user_id).await.map_err(|e| e.to_string())
}

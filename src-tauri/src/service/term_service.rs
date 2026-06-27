use sqlx::SqlitePool;
use crate::{domain::{request::{CreateTermRequest, CreateTermNoteRequest}, model::{Term, TermNote}}, repository::term_repository};

pub async fn create_term(db: &SqlitePool, request: CreateTermRequest) -> Result<Term, String> {
    if request.source_term.trim().is_empty() || request.target_term.trim().is_empty() {
        return Err("source_term and target_term are required".to_string());
    }

    term_repository::create_term(db, request).await.map_err(|e| e.to_string())
}

pub async fn create_term_note(db: &SqlitePool, request: CreateTermNoteRequest) -> Result<TermNote, String> {
    term_repository::create_term_note(db, request).await.map_err(|e| e.to_string())
}

use sqlx::SqlitePool;
use crate::domain::{request::{CreateTermRequest, CreateTermNoteRequest}, model::{Term, TermNote}};

pub async fn create_term(db: &SqlitePool, request: CreateTermRequest) -> Result<Term, sqlx::Error> {
    sqlx::query_as::<_, Term>(
        r#"
        INSERT INTO terms (domain_category_id, source_term, target_term, description)
        VALUES (?, ?, ?, ?)
        RETURNING id, domain_category_id, source_term, target_term, description
        "#,
    )
    .bind(request.domain_category_id)
    .bind(request.source_term)
    .bind(request.target_term)
    .bind(request.description)
    .fetch_one(db)
    .await
}

pub async fn create_term_note(db: &SqlitePool, request: CreateTermNoteRequest) -> Result<TermNote, sqlx::Error> {
    sqlx::query_as::<_, TermNote>(
        r#"
        INSERT INTO term_notes (user_id, term_id, memo)
        VALUES (?, ?, ?)
        RETURNING id, user_id, term_id, memo, memorized, created_at
        "#,
    )
    .bind(request.user_id)
    .bind(request.term_id)
    .bind(request.memo)
    .fetch_one(db)
    .await
}

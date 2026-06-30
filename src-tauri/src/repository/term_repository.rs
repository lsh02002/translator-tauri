use sqlx::SqlitePool;
use crate::domain::{model::{Term, TermNote}, request::{CreateTermRequest, CreateTermNoteRequest}};

pub async fn create_term(db: &SqlitePool, request: CreateTermRequest) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO terms (domain_category_id, source_term, target_term, description)
        VALUES (?, ?, ?, ?)        
        "#,
    )
    .bind(request.domain_category_id)
    .bind(request.source_term)
    .bind(request.target_term)
    .bind(request.description)
    .execute(db)
    .await?;

    Ok(())
}

pub async fn create_term_note(db: &SqlitePool, user_id: i64, request: CreateTermNoteRequest) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO term_notes (user_id, term_id, memo)
        VALUES (?, ?, ?)        
        "#,
    )
    .bind(user_id)
    .bind(request.term_id)
    .bind(request.memo)
    .execute(db)
    .await?;

    Ok(())
}

pub async fn update_term(
    db: &SqlitePool,
    id: i64,
    request: CreateTermRequest,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE terms
        SET
            domain_category_id = ?,
            source_term = ?,
            target_term = ?,
            description = ?
        WHERE id = ?
        "#,
    )
    .bind(request.domain_category_id)
    .bind(request.source_term)
    .bind(request.target_term)
    .bind(request.description)
    .bind(id)
    .execute(db)
    .await?;

    Ok(())
}

pub async fn update_term_note(
    db: &SqlitePool,
    id: i64,
    user_id: i64,
    request: CreateTermNoteRequest,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE term_notes
        SET
            term_id = ?,
            memo = ?
        WHERE id = ? AND user_id = ?
        "#,
    )
    .bind(request.term_id)
    .bind(request.memo)
    .bind(id)
    .bind(user_id)
    .execute(db)
    .await?;

    Ok(())
}

pub async fn find_all_terms(
    db: &SqlitePool,
) -> Result<Vec<Term>, sqlx::Error> {
    sqlx::query_as::<_, Term>(
        r#"
        SELECT
            t.id,
            dc.name AS domain_category_name,
            t.source_term,
            t.target_term,
            t.description,
            t.created_at
        FROM terms t
        LEFT JOIN domain_categories dc
            ON t.domain_category_id = dc.id
        ORDER BY t.id ASC
        "#,
    )
    .fetch_all(db)
    .await
}

pub async fn find_term_by_id(
    db: &SqlitePool,
    id: i64,
) -> Result<Term, sqlx::Error> {
    sqlx::query_as::<_, Term>(
        r#"
        SELECT
            t.id,
            dc.name AS domain_category_name,
            t.source_term,
            t.target_term,
            t.description,
            t.created_at
        FROM terms t
        LEFT JOIN domain_categories dc
            ON t.domain_category_id = dc.id
        WHERE t.id = ?
        "#,
    )
    .bind(id)
    .fetch_one(db)
    .await
}

pub async fn find_all_term_notes(
    db: &SqlitePool,
    user_id: i64,
) -> Result<Vec<TermNote>, sqlx::Error> {
    sqlx::query_as::<_, TermNote>(
        r#"
        SELECT
            id,
            user_id,
            term_id,
            memo,
            created_at
        FROM term_notes
        WHERE user_id = ?
        ORDER BY id ASC
        "#,
    )
    .bind(user_id)
    .fetch_all(db)
    .await
}

pub async fn find_term_note_by_id(
    db: &SqlitePool,
    id: i64,
    user_id: i64,
) -> Result<TermNote, sqlx::Error> {
    sqlx::query_as::<_, TermNote>(
        r#"
        SELECT
            id,
            user_id,
            term_id,
            memo,
            created_at
        FROM term_notes
        WHERE id = ? AND user_id = ?
        "#,
    )
    .bind(id)
    .bind(user_id)
    .fetch_one(db)
    .await
}

pub async fn delete_term(
    db: &SqlitePool,
    id: i64,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM terms
        WHERE id = ?
        "#,
    )
    .bind(id)
    .execute(db)
    .await?;

    Ok(())
}

pub async fn delete_term_note(
    db: &SqlitePool,
    id: i64,
    user_id: i64,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM term_notes
        WHERE id = ? AND user_id = ?
        "#,
    )
    .bind(id)
    .bind(user_id)
    .execute(db)
    .await?;

    Ok(())
}

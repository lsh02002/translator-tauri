use sqlx::SqlitePool;
use crate::domain::{request::CreatePracticeTextRequest, model::PracticeText};

pub async fn create(db: &SqlitePool, user_id: i64, request: CreatePracticeTextRequest) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO practice_texts
        (user_id, domain_category_id, source_language_type, source_language, target_language, difficulty, sample_translation, tips)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(user_id)
    .bind(request.domain_category_id)
    .bind(request.source_language_type)
    .bind(request.source_language)
    .bind(request.target_language)
    .bind(request.difficulty)
    .bind(request.sample_translation)
    .bind(request.tips)
    .execute(db)
    .await?;

    Ok(())
}

pub async fn update(
    db: &SqlitePool,
    id: i64,
    user_id: i64,
    request: CreatePracticeTextRequest,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE practice_texts
        SET
            user_id = ?,
            domain_category_id = ?,
            source_language_type = ?,
            source_language = ?,
            target_language = ?,
            difficulty = ?,
            sample_translation = ?,
            tips = ?
        WHERE id = ?
        "#,
    )
    .bind(user_id)
    .bind(request.domain_category_id)
    .bind(request.source_language_type)
    .bind(request.source_language)
    .bind(request.target_language)
    .bind(request.difficulty)
    .bind(request.sample_translation)
    .bind(request.tips)
    .bind(id)
    .execute(db)
    .await?;

    Ok(())
}

pub async fn find_all(db: &SqlitePool, user_id: i64) -> Result<Vec<PracticeText>, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        SELECT
            pt.id,
            pt.user_id,            
            dc.name AS domain_category_name,
            pt.source_language_type,
            pt.source_language,
            pt.target_language,
            pt.difficulty,
            pt.sample_translation,
            pt.tips,
            pt.created_at
        FROM practice_texts pt
        LEFT JOIN domain_categories dc
            ON pt.domain_category_id = dc.id
        WHERE pt.user_id = ?
        ORDER BY pt.id ASC
        "#,
    )
    .bind(user_id)
    .fetch_all(db)
    .await
}

pub async fn find_by_id(db: &SqlitePool, id: i64, user_id: i64) -> Result<PracticeText, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        SELECT
            pt.id,
            pt.user_id,            
            dc.name AS domain_category_name,
            pt.source_language_type,
            pt.source_language,
            pt.target_language,
            pt.difficulty,
            pt.sample_translation,
            pt.tips,
            pt.created_at
        FROM practice_texts pt
        LEFT JOIN domain_categories dc
            ON pt.domain_category_id = dc.id
        WHERE pt.id = ? AND pt.user_id = ?
        "#,
    )
    .bind(id)
    .bind(user_id)
    .fetch_one(db)
    .await
}

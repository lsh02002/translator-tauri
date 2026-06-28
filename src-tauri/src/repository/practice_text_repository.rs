use sqlx::SqlitePool;
use crate::domain::{request::CreatePracticeTextRequest, model::PracticeText};

pub async fn create(db: &SqlitePool, user_id: i64, request: CreatePracticeTextRequest) -> Result<PracticeText, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        INSERT INTO practice_texts
        (user_id, domain_category_id, source_language_type, source_language, target_language, difficulty, sample_translation, tips)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id, user_id, domain_category_id, source_language_type, source_language, target_language,
                  difficulty, sample_translation, tips, created_at
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
    .fetch_one(db)
    .await
}

pub async fn update(
    db: &SqlitePool,
    id: i64,
    user_id: i64,
    request: CreatePracticeTextRequest,
) -> Result<PracticeText, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
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
        RETURNING
            id,
            user_id,
            domain_category_id,
            source_language_type,
            source_language,
            target_language,
            difficulty,
            sample_translation,
            tips,
            created_at
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
    .fetch_one(db)
    .await
}

pub async fn find_all(db: &SqlitePool, user_id: i64) -> Result<Vec<PracticeText>, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        SELECT id, user_id, domain_category_id, source_language_type, source_language, target_language,
               difficulty, sample_translation, tips, created_at
        FROM practice_texts
        WHERE user_id = ?
        ORDER BY id ASC
        "#,
    )
    .bind(user_id)
    .fetch_all(db)
    .await
}

pub async fn find_by_id(db: &SqlitePool, id: i64, user_id: i64) -> Result<PracticeText, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        SELECT id, user_id, domain_category_id, source_language_type, source_language, target_language,
               difficulty, sample_translation, tips, created_at
        FROM practice_texts
        WHERE id = ? AND user_id = ?
        "#,
    )
    .bind(id)
    .bind(user_id)
    .fetch_one(db)
    .await
}
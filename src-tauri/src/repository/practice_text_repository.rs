use sqlx::SqlitePool;
use crate::domain::{request::CreatePracticeTextRequest, model::PracticeText};

pub async fn create(db: &SqlitePool, request: CreatePracticeTextRequest) -> Result<PracticeText, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        INSERT INTO practice_texts
        (domain_category_id, source_language_type, source_language, target_language, difficulty, sample_translation, tips)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id, domain_category_id, source_language_type, source_language, target_language,
                  difficulty, sample_translation, tips, created_at
        "#,
    )
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
    request: CreatePracticeTextRequest,
) -> Result<PracticeText, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        UPDATE practice_texts
        SET
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

pub async fn find_all(db: &SqlitePool) -> Result<Vec<PracticeText>, sqlx::Error> {
    sqlx::query_as::<_, PracticeText>(
        r#"
        SELECT id, domain_category_id, source_language_type, source_language, target_language,
               difficulty, sample_translation, tips, created_at
        FROM practice_texts
        ORDER BY id ASC
        "#,
    )
    .fetch_all(db)
    .await
}

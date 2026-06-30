use sqlx::SqlitePool;
use crate::domain::{model::DomainCategory, request::CreateDomainCategoryRequest};

pub async fn create(
    db: &SqlitePool,
    user_id: i64,
    request: CreateDomainCategoryRequest,
    ) -> Result<DomainCategory, sqlx::Error> {
    sqlx::query_as::<_, DomainCategory>(
        r#"
        INSERT INTO domain_categories (user_id, name, description)
        VALUES (?, ?, ?)
        RETURNING id, user_id, name, description
        "#,
    )
    .bind(user_id)
    .bind(request.name)
    .bind(request.description)
    .fetch_one(db)
    .await
}

pub async fn update(
    db: &SqlitePool,
    user_id: i64,
    category_id: i64,
    request: CreateDomainCategoryRequest,
) -> Result<DomainCategory, sqlx::Error> {
    sqlx::query_as::<_, DomainCategory>(
        r#"
        UPDATE domain_categories
        SET
            name = ?,
            description = ?
        WHERE
            id = ?
            AND user_id = ?
        RETURNING id, user_id, name, description
        "#,
    )
    .bind(request.name)
    .bind(request.description)
    .bind(category_id)
    .bind(user_id)
    .fetch_one(db)
    .await
}

pub async fn find_all(db: &SqlitePool, user_id: i64) -> Result<Vec<DomainCategory>, sqlx::Error> {
    sqlx::query_as::<_, DomainCategory>(
        "SELECT id, user_id, name, description FROM domain_categories WHERE user_id = ? ORDER BY id DESC",
    )
    .bind(user_id)
    .fetch_all(db)
    .await
}

pub async fn delete(db: &SqlitePool, user_id: i64, category_id: i64) -> Result<(), sqlx::Error> {
    sqlx::query(
        "DELETE FROM domain_categories WHERE id = ? AND user_id = ?",
    )
    .bind(category_id)
    .bind(user_id)
    .execute(db)
    .await
    .map(|_| ())
}

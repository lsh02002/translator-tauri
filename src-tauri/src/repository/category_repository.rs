use sqlx::SqlitePool;
use crate::domain::model::DomainCategory;

pub async fn create(
    db: &SqlitePool,
    name: String,
    description: Option<String>,
) -> Result<DomainCategory, sqlx::Error> {
    sqlx::query_as::<_, DomainCategory>(
        r#"
        INSERT INTO domain_categories (name, description)
        VALUES (?, ?)
        RETURNING id, name, description
        "#,
    )
    .bind(name)
    .bind(description)
    .fetch_one(db)
    .await
}

pub async fn find_all(db: &SqlitePool) -> Result<Vec<DomainCategory>, sqlx::Error> {
    sqlx::query_as::<_, DomainCategory>(
        "SELECT id, name, description FROM domain_categories ORDER BY id DESC",
    )
    .fetch_all(db)
    .await
}

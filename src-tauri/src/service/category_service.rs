use sqlx::SqlitePool;
use crate::{domain::model::DomainCategory, repository::category_repository};

pub async fn create_domain_category(
    db: &SqlitePool,
    name: String,
    description: Option<String>,
) -> Result<DomainCategory, String> {
    if name.trim().is_empty() {
        return Err("category name is required".to_string());
    }

    category_repository::create(db, name, description)
        .await
        .map_err(|e| e.to_string())
}

pub async fn get_domain_categories(db: &SqlitePool) -> Result<Vec<DomainCategory>, String> {
    category_repository::find_all(db).await.map_err(|e| e.to_string())
}

use sqlx::SqlitePool;
use crate::{domain::{model::DomainCategory, request::CreateDomainCategoryRequest}, repository::category_repository};

pub async fn create_domain_category(
    db: &SqlitePool,
    user_id: i64,
    request: CreateDomainCategoryRequest,
) -> Result<DomainCategory, String> {
    if request.name.trim().is_empty() {
        return Err("카테고리 이름을 입력해주세요.".to_string());
    }

    category_repository::create(db, user_id, request)
        .await
        .map_err(|e| e.to_string())
}

pub async fn update_domain_category(
    db: &SqlitePool,
    user_id: i64,
    category_id: i64,
    request: CreateDomainCategoryRequest,
) -> Result<DomainCategory, String> {
    if request.name.trim().is_empty() {
        return Err("카테고리 이름란이 비어있습니다.".to_string());
    }

    let current = category_repository::find_by_id(db, user_id, category_id).await.map_err(|e| e.to_string())?;

    // 변경 여부 확인
    if current.name == request.name && current.description == request.description {
        return Err("변경사항이 없습니다.".into());
    }

    category_repository::update(db, user_id, category_id, request)
        .await
        .map_err(|e| e.to_string())
}

pub async fn get_domain_categories(db: &SqlitePool, user_id: i64) -> Result<Vec<DomainCategory>, String> {
    category_repository::find_all(db, user_id).await.map_err(|e| e.to_string())
}

pub async fn get_domain_category(db: &SqlitePool, user_id: i64, category_id: i64) -> Result<DomainCategory, String> {
    category_repository::find_by_id(db, user_id, category_id).await.map_err(|e| e.to_string())
}

pub async fn delete_domain_category(db: &SqlitePool, user_id: i64, category_id: i64) -> Result<(), String> {
    category_repository::delete(db, user_id, category_id).await.map_err(|e| e.to_string())
}

use tauri::State;
use crate::{AppState, domain::{model::DomainCategory, request::CreateDomainCategoryRequest}, service::{category_service, user_service::current_user}};

#[tauri::command]
pub async fn create_domain_category(
    state: State<'_, AppState>,
    token: String,
    request: CreateDomainCategoryRequest,
) -> Result<DomainCategory, String> {
    let user_id = current_user(&token)?;
    category_service::create_domain_category(&state.db, user_id, request).await
}

#[tauri::command]
pub async fn update_domain_category(
    state: State<'_, AppState>,
    token: String,
    category_id: i64,
    request: CreateDomainCategoryRequest,
) -> Result<DomainCategory, String> {
    let user_id = current_user(&token)?;
    category_service::update_domain_category(&state.db, user_id, category_id, request).await
}

#[tauri::command]
pub async fn get_domain_categories(state: State<'_, AppState>, token: String) -> Result<Vec<DomainCategory>, String> {
    let user_id = current_user(&token)?;
    category_service::get_domain_categories(&state.db, user_id).await
}

#[tauri::command]
pub async fn get_domain_category(state: State<'_, AppState>, token: String, category_id: i64) -> Result<DomainCategory, String> {
    let user_id = current_user(&token)?;
    category_service::get_domain_category(&state.db, user_id, category_id).await
}

#[tauri::command]
pub async fn delete_domain_category(state: State<'_, AppState>, token: String, category_id: i64) -> Result<(), String> {
    let user_id = current_user(&token)?;
    category_service::delete_domain_category(&state.db, user_id, category_id).await
}

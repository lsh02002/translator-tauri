use tauri::State;
use crate::{AppState, domain::model::DomainCategory, service::category_service};

#[tauri::command]
pub async fn create_domain_category(
    state: State<'_, AppState>,
    name: String,
    description: Option<String>,
) -> Result<DomainCategory, String> {
    category_service::create_domain_category(&state.db, name, description).await
}

#[tauri::command]
pub async fn get_domain_categories(state: State<'_, AppState>) -> Result<Vec<DomainCategory>, String> {
    category_service::get_domain_categories(&state.db).await
}

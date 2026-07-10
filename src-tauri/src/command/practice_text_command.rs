use tauri::State;
use crate::{AppState, domain::{model::PracticeText, request::CreatePracticeTextRequest}, service::{practice_text_service, user_service::current_user}};

#[tauri::command]
pub async fn create_practice_text(
    state: State<'_, AppState>,
    token: String,
    request: CreatePracticeTextRequest,
) -> Result<(), String> {
    let user_id = current_user(&token)?;
    practice_text_service::create_practice_text(&state.db, user_id, request).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_practice_text(
    state: State<'_, AppState>,
    token: String,
    id: i64,
    request: CreatePracticeTextRequest,
) -> Result<(), String> {
    let user_id = current_user(&token)?;
    practice_text_service::update_practice_text(&state.db, id, user_id, request).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_practice_texts(state: State<'_, AppState>, token: String) -> Result<Vec<PracticeText>, String> {
    let user_id = current_user(&token)?;
    practice_text_service::get_practice_texts(&state.db, user_id).await
}

#[tauri::command]
pub async fn get_practice_text(state: State<'_, AppState>, token: String, id: i64) -> Result<PracticeText, String> {
    let user_id = current_user(&token)?;
    practice_text_service::get_practice_text(&state.db, id, user_id).await
}

use tauri::State;
use crate::{AppState, domain::{request::CreatePracticeTextRequest, model::PracticeText}, service::practice_text_service};

#[tauri::command]
pub async fn create_practice_text(
    state: State<'_, AppState>,
    request: CreatePracticeTextRequest,
) -> Result<PracticeText, String> {
    practice_text_service::create_practice_text(&state.db, request).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_practice_text(
    state: State<'_, AppState>,
    id: i64,
    request: CreatePracticeTextRequest,
) -> Result<PracticeText, String> {
    practice_text_service::update_practice_text(&state.db, id, request).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_practice_texts(state: State<'_, AppState>) -> Result<Vec<PracticeText>, String> {
    practice_text_service::get_practice_texts(&state.db).await
}

use tauri::State;
use crate::{AppState, domain::request::{CreateTermNoteRequest, CreateTermRequest}, service::{term_service, user_service::current_user}};

#[tauri::command]
pub async fn create_term(state: State<'_, AppState>, token: String, request: CreateTermRequest) -> Result<(), String> {
    let _ = current_user(&token)?;
    term_service::create_term(&state.db, request).await
}

#[tauri::command]
pub async fn create_term_note(state: State<'_, AppState>, token: String, request: CreateTermNoteRequest) -> Result<(), String> {
    let user_id = current_user(&token)?;
    term_service::create_term_note(&state.db, user_id, request).await
}

#[tauri::command]
pub async fn update_term(state: State<'_, AppState>, token: String, id: i64, request: CreateTermRequest) -> Result<(), String> {
    let _ = current_user(&token)?;
    term_service::update_term(&state.db, id, request).await
}

#[tauri::command]
pub async fn update_term_note(state: State<'_, AppState>, token: String, id: i64, request: CreateTermNoteRequest) -> Result<(), String> {
    let user_id = current_user(&token)?;
    term_service::update_term_note(&state.db, id, user_id, request).await
}

#[tauri::command]
pub async fn get_term_notes(state: State<'_, AppState>, token: String) -> Result<Vec<crate::domain::model::TermNote>, String> {
    let user_id = current_user(&token)?;
    term_service::get_term_notes(&state.db, user_id).await
}

#[tauri::command]
pub async fn get_term_note_by_id(state: State<'_, AppState>, token: String, id: i64) -> Result<crate::domain::model::TermNote, String> {
    let user_id = current_user(&token)?;
    term_service::get_term_note_by_id(&state.db, user_id, id).await
}

#[tauri::command]
pub async fn delete_term(state: State<'_, AppState>, token: String, id: i64) -> Result<(), String> {
    let _ = current_user(&token)?;
    term_service::delete_term(&state.db, id).await
}

#[tauri::command]
pub async fn delete_term_note(state: State<'_, AppState>, token: String, id: i64) -> Result<(), String> {
    let user_id = current_user(&token)?;
    term_service::delete_term_note(&state.db, id, user_id).await
}

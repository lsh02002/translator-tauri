use tauri::State;
use crate::{AppState, domain::{request::{CreateTermRequest, CreateTermNoteRequest}, model::{Term, TermNote}}, service::term_service};

#[tauri::command]
pub async fn create_term(state: State<'_, AppState>, request: CreateTermRequest) -> Result<Term, String> {
    term_service::create_term(&state.db, request).await
}

#[tauri::command]
pub async fn create_term_note(state: State<'_, AppState>, request: CreateTermNoteRequest) -> Result<TermNote, String> {
    term_service::create_term_note(&state.db, request).await
}

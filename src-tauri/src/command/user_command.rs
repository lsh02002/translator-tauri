use tauri::State;
use crate::{AppState, domain::{request::{CreateUserRequest, AuthResponse, LoginRequest}, model::User}, service::user_service};

#[tauri::command]
pub async fn create_user(state: State<'_, AppState>, request: CreateUserRequest) -> Result<User, String> {
    user_service::create_user(&state.db, request).await
}

#[tauri::command]
pub async fn get_users(state: State<'_, AppState>) -> Result<Vec<User>, String> {
    user_service::get_users(&state.db).await
}

#[tauri::command]
pub async fn register(
    state: State<'_, AppState>,
    request: CreateUserRequest,
) -> Result<AuthResponse, String> {
    user_service::register(&state.db, request).await
}

#[tauri::command]
pub async fn login(
    state: State<'_, AppState>,
    request: LoginRequest,
) -> Result<AuthResponse, String> {
    user_service::login(&state.db, request).await
}

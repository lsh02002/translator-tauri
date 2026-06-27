pub mod command;
pub mod domain;
pub mod repository;
pub mod service;

use std::fs;

use dotenvy::dotenv;
use repository::db::{create_pool, init_db};

#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::SqlitePool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    dotenv().ok();

    let app_data_dir = dirs::data_dir()
        .expect("failed to get data dir")
        .join("translator-tauri");

    fs::create_dir_all(&app_data_dir)
        .expect("failed to create app data dir");

    let db_path = app_data_dir.join("translator_trainer.db");

    let database_url = format!(
        "sqlite://{}?mode=rwc",
        db_path.to_string_lossy()
    );

    let db = create_pool(&database_url)
        .await
        .expect("DB connection failed");

    init_db(&db).await.expect("DB init failed");

    tauri::Builder::default()
        .manage(AppState { db })
        .invoke_handler(tauri::generate_handler![
            command::user_command::register,
            command::user_command::login,
            command::user_command::create_user,
            command::user_command::get_users,
            command::category_command::create_domain_category,
            command::category_command::get_domain_categories,
            command::practice_text_command::create_practice_text,
            command::practice_text_command::update_practice_text,
            command::practice_text_command::get_practice_texts,            
            command::term_command::create_term,
            command::term_command::create_term_note,
        ])
        .run(tauri::generate_context!())
        .expect("Tauri app failed");
}
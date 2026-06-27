use sqlx::SqlitePool;
use crate::domain::{model::User};

pub async fn create_user(
    db: &SqlitePool,
    email: String,
    nickname: String,
    password: String,
    role: Option<String>,
) -> Result<User, sqlx::Error> {

    let role = role.unwrap_or_else(|| "student".to_string());

    sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users
        (email, nickname, password, role)
        VALUES (?, ?, ?, ?)
        RETURNING
            id,
            email,
            nickname,
            password,
            role,
            created_at
        "#
    )
    .bind(email)
    .bind(nickname)
    .bind(password)
    .bind(role)
    .fetch_one(db)
    .await
}

pub async fn find_all(db: &SqlitePool) -> Result<Vec<User>, sqlx::Error> {
    sqlx::query_as::<_, User>(
        "SELECT id, email, nickname, password, role, created_at FROM users ORDER BY id DESC",
    )
    .fetch_all(db)
    .await
}

pub async fn find_by_email(
    db: &SqlitePool,
    email: String,
) -> Result<User, sqlx::Error> {
    sqlx::query_as::<_, User>(
        r#"
        SELECT id, email, nickname, password, role, created_at
        FROM users
        WHERE email = ?
        "#
    )
    .bind(email)
    .fetch_one(db)
    .await
}

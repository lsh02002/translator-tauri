use sqlx::SqlitePool;
use crate::{domain::{request::{CreateUserRequest, AuthResponse, LoginRequest}, model::User}, repository::user_repository};
use bcrypt::{hash, verify, DEFAULT_COST};
use crate::repository::{jwt::{create_token, verify_token}};

pub async fn get_users(db: &SqlitePool) -> Result<Vec<User>, String> {    
    user_repository::find_all(db).await.map_err(|e| e.to_string())
}

pub async fn register(
    db: &SqlitePool,
    request: CreateUserRequest,
) -> Result<AuthResponse, String> {
    if request.email.trim().is_empty() {
        return Err("이메일란이 비어있습니다.".to_string());
    }
    if request.nickname.trim().is_empty() {
        return Err("닉네임란이 비어있습니다.".to_string());
    }

    let password =
        hash(&request.password, DEFAULT_COST)
            .map_err(|e| e.to_string())?;

    let user = user_repository::create_user(
            db,
            request.email,
            request.nickname,
            password,
            request.role,
        )
        .await
        .map_err(|e| e.to_string())?;

    let token = create_token(user.id, user.email.clone(), user.role.clone())?;

    Ok(AuthResponse {
        token,
        user_id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
    })
}

pub async fn login(
    db: &SqlitePool,
    request: LoginRequest,
) -> Result<AuthResponse, String> {
    let user = user_repository::find_by_email(&db, request.email)
        .await
        .map_err(|_| "이메일 또는 비밀번호가 올바르지 않습니다.".to_string())?;

    let valid = verify(request.password, &user.password)
        .map_err(|e| e.to_string())?;

    if !valid {
        return Err("이메일 또는 비밀번호가 올바르지 않습니다.".to_string());
    }

    let token = create_token(user.id, user.email.clone(), user.role.clone())?;

    Ok(AuthResponse {
        token,
        user_id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
    })
}

pub fn current_user(
    token: &str,
) -> Result<i64, String> {
    Ok(verify_token(token)?.sub)
}

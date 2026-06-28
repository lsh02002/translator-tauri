use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i64,
    pub email: String,
    pub role: String,
    pub exp: usize,
}

pub fn create_token(user_id: i64, email: String, role: String) -> Result<String, String> {
    let jwt_secret = jwt_secret()?;

    let exp = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .unwrap()
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id,
        email,
        role,
        exp,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_bytes()),
    )
    .map_err(|e| e.to_string())
}

pub fn verify_token(token: &str) -> Result<Claims, String> {
    let jwt_secret = jwt_secret()?;
    
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .map_err(|e| e.to_string())
}

fn jwt_secret() -> Result<String, String> {
    dotenvy::dotenv().ok();

    std::env::var("JWT_SECRET")
        .map_err(|_| "JWT_SECRET not set in .env".to_string())
}

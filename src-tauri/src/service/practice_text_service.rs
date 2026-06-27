use sqlx::SqlitePool;
use crate::{domain::{request::CreatePracticeTextRequest, model::PracticeText}, repository::practice_text_repository};
use crate::service::openai_service::review_translation_answer;

pub async fn create_practice_text(
    db: &SqlitePool,
    request: CreatePracticeTextRequest,
) -> Result<PracticeText, Box<dyn std::error::Error>> {
    let review = review_translation_answer(
        &request.source_language_type,
        &request.source_language,
        &request.target_language,
    )
    .await
    .map_err(|e| e.to_string())?;

    let request = CreatePracticeTextRequest {
        sample_translation: Some(review.translation.clone()),
        tips: Some(serde_json::to_string(&review)?),
        ..request
    };
    
    let practice_text = practice_text_repository::create(db, request).await.map_err(|e| e.to_string())?;

    Ok(practice_text)
}

pub async fn update_practice_text(
    db: &SqlitePool,
    id: i64,
    request: CreatePracticeTextRequest,
) -> Result<PracticeText, Box<dyn std::error::Error>> {
    let review = review_translation_answer(
        &request.source_language_type,
        &request.source_language,
        &request.target_language,
    )
    .await
    .map_err(|e| e.to_string())?;

    let request = CreatePracticeTextRequest {
        sample_translation: Some(review.translation.clone()),
        tips: Some(serde_json::to_string(&review)?),
        ..request
    };
    
    let practice_text = practice_text_repository::update(db, id, request).await.map_err(|e| e.to_string())?;

    Ok(practice_text)
}

pub async fn get_practice_texts(db: &SqlitePool) -> Result<Vec<PracticeText>, String> {
    practice_text_repository::find_all(db).await.map_err(|e| e.to_string())
}

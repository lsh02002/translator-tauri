use sqlx::SqlitePool;
use crate::{domain::{request::CreatePracticeTextRequest, model::PracticeText}, repository::practice_text_repository};
use crate::service::openai_service::review_translation_answer;

pub async fn create_practice_text(
    db: &SqlitePool,
    user_id: i64,
    request: CreatePracticeTextRequest,
) -> Result<(), Box<dyn std::error::Error>> {
    let review = review_translation_answer(
        &request.source_language_type,
        &request.source_language,
        &request.target_language,
    )
    .await
    .map_err(|e| e.to_string())?;

    let request = CreatePracticeTextRequest {
        sample_translation: Some(review.translation.clone()),
        difficulty: Some(review.difficulty.clone()),
        tips: Some(serde_json::to_string(&review)?),
        ..request
    };
    
    let _ = practice_text_repository::create(db, user_id, request).await.map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn update_practice_text(
    db: &SqlitePool,
    id: i64,
    user_id: i64,
    request: CreatePracticeTextRequest,
) -> Result<(), Box<dyn std::error::Error>> {
    let current = practice_text_repository::find_by_id(db, id, user_id).await?;

    // 변경 여부 확인
    if current.source_language_type == request.source_language_type
        && current.source_language == request.source_language
        && current.target_language == request.target_language
    {
        return Err("변경사항이 없습니다.".into());
    }

    let review = review_translation_answer(
        &request.source_language_type,
        &request.source_language,
        &request.target_language,
    )
    .await
    .map_err(|e| e.to_string())?;

    let request = CreatePracticeTextRequest {
        sample_translation: Some(review.translation.clone()),
        difficulty: Some(review.difficulty.clone()),
        tips: Some(serde_json::to_string(&review)?),
        ..request
    };
    
    let _ = practice_text_repository::update(db, id, user_id, request).await.map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn get_practice_texts(db: &SqlitePool, user_id: i64) -> Result<Vec<PracticeText>, String> {
    practice_text_repository::find_all(db, user_id).await.map_err(|e| e.to_string())
}

pub async fn get_practice_text(db: &SqlitePool, id: i64, user_id: i64) -> Result<PracticeText, String> {
    practice_text_repository::find_by_id(db, id, user_id).await.map_err(|e| e.to_string())
}

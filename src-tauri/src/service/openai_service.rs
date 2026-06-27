use reqwest::Client;
use serde_json::{json, Value};
use crate::domain::model::ReviewResult;

pub async fn review_translation_answer(
    source_language_type: &str,
    source_text: &str,
    user_answer: &str,
) -> Result<ReviewResult, Box<dyn std::error::Error>> {
    let api_key = std::env::var("OPENAI_API_KEY")?;
    
    let source_language_name = match source_language_type {
        "ko" | "ko-KR" => "한국어",
        "en" | "en-US" => "영어",
        _ => "한국어",
    };

    let target_language_name = match source_language_type {
        "ko" | "ko-KR" => "영어",
        "en" | "en-US" => "한국어",
        _ => "영어",
    };

    let user_prompt = format!(
        r#"
        너는 번역 학습 답안을 채점하는 선생님이다.

        원문 언어: {source_language_name}
        번역 목표 언어: {target_language_name}

        원문:
        {source_text}

        사용자 답안:
        {user_answer}

        해야 할 일:
        1. 원문을 번역 목표 언어로 자연스럽게 번역한다.
        2. 사용자 답안이 그 의미를 잘 전달했는지 평가한다.
        3. 표현이 완전히 같지 않아도 의미가 자연스럽고 정확하면 정답으로 본다.
        4. 틀린 부분이 있으면 짧게 설명한다.
        5. 필요하면 더 자연스러운 수정 답안을 제시한다.

        반드시 아래 JSON 형식만 출력해라. 설명 문장은 JSON 밖에 쓰지 마라.

        {{
        "translation": "...",
        "is_correct": true,
        "score": 100,
        "review": "...",
        "corrected_answer": "..."
        }}
        "#
    );

    let body = json!({
        "model": "gpt-5.4-mini",
        "input": [
            {
                "role": "system",
                "content": "너는 번역 학습 답안을 평가하는 선생님이다. 반드시 JSON만 출력한다."
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        "text": {
            "format": {
                "type": "json_object"
            }
        }
    });

    let value: Value = Client::new()
        .post("https://api.openai.com/v1/responses")
        .bearer_auth(api_key)
        .json(&body)
        .send()
        .await?
        .json()
        .await?;

    let text = value["output"][0]["content"][0]["text"]
        .as_str()
        .unwrap_or("")
        .trim();

    let result: ReviewResult = serde_json::from_str(text)?;

    Ok(result)
}

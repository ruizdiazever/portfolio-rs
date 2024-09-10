use tracing::error;
use reqwest::Client;
use serde_json::json;

pub async fn post_feedback_request(id: String, reaction: u8, msg: String, title: String) -> bool {
    let client = Client::new();
    let api_url = std::env::var("API_URL").unwrap();
    let url = format!("{}/feedback", api_url);

    let body = json!({
        "id": id,
        "msg": msg,
        "reaction": reaction,
        "title": title
    });

    match client.post(&url).json(&body).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<serde_json::Value>().await {
                    Ok(data) => data["success"].as_bool().unwrap_or(false),
                    Err(err) => {
                        error!("Failed to parse JSON response: {}", err);
                        false
                    }
                }
            } else {
                error!("Error during the feedback request: {}", response.status());
                false
            }
        }
        Err(err) => {
            error!("POST request failed: {}", err);
            false
        }
    }
}

pub async fn post_visit_request(project_id: String) -> i64 {
    let client = Client::new();
    let api_url = std::env::var("API_URL").unwrap();
    let url = format!("{}/visit", api_url);

    let body = json!({
        "project_id": project_id,
    });

    match client.post(&url).json(&body).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<serde_json::Value>().await {
                    Ok(data) => data["visits"].as_i64().unwrap_or(0),
                    Err(err) => {
                        error!("Failed to parse JSON response: {}", err);
                        0
                    }
                }
            } else {
                error!("Error during the visit request: {}", response.status());
                0
            }
        }
        Err(err) => {
            error!("POST request failed: {}", err);
            0
        }
    }
}

pub async fn get_visit_request(project_id: String) -> i64 {
    let client = Client::new();
    let api_url = std::env::var("API_URL").unwrap();
    let url = format!("{}/visit/{}", api_url, project_id);

    match client.get(&url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<serde_json::Value>().await {
                    Ok(data) => data["visits"].as_i64().unwrap_or(0),
                    Err(err) => {
                        error!("Failed to parse JSON response: {}", err);
                        0
                    }
                }
            } else {
                error!("Error during the visit request: {}", response.status());
                0
            }
        }
        Err(err) => {
            error!("POST request failed: {}", err);
            0
        }
    }
}

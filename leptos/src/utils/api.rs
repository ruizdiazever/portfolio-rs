use reqwest::Client;
use serde_json::json;

pub async fn post_feedback_request(id: String, reaction: u8, msg: String, title: String) -> bool {
    let client = Client::new();
    let api_url = std::env::var("API_URL").unwrap();

    let url = if !api_url.starts_with("http://") && !api_url.starts_with("https://") {
        format!("http://{}/feedback", api_url)
    } else {
        format!("{}/feedback", api_url)
    };

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
                        println!("Failed to parse JSON response: {}", err);
                        false
                    }
                }
            } else {
                println!("Error during the feedback request: {}", response.status());
                false
            }
        }
        Err(err) => {
            println!("POST request failed in post_feedback_request: {}", err);
            false
        }
    }
}

pub async fn post_visit_request(project_id: String) -> i64 {
    let client = Client::new();
    let api_url = std::env::var("API_URL").unwrap();

    let url = if !api_url.starts_with("http://") && !api_url.starts_with("https://") {
        format!("http://{}/visit", api_url)
    } else {
        format!("{}/visit", api_url)
    };

    let body = json!({
        "project_id": project_id,
    });

    match client.post(&url).json(&body).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<serde_json::Value>().await {
                    Ok(data) => data["visits"].as_i64().unwrap_or(0),
                    Err(err) => {
                        println!("Failed to parse JSON response: {}", err);
                        0
                    }
                }
            } else {
                println!("Error during the visit request: {}", response.status());
                0
            }
        }
        Err(err) => {
            println!("POST request failed in post_visit_request: {}", err);
            0
        }
    }
}

pub async fn get_visit_request(project_id: String) -> i64 {
    let client = Client::new();
    let api_url = std::env::var("API_URL").unwrap();
    let url = if !api_url.starts_with("http://") && !api_url.starts_with("https://") {
        format!("http://{}/visit/{}", api_url, project_id)
    } else {
        format!("{}/visit/{}", api_url, project_id)
    };

    match client.get(&url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<serde_json::Value>().await {
                    Ok(data) => data["visits"].as_i64().unwrap_or(0),
                    Err(err) => {
                        println!("Failed to parse JSON response: {}", err);
                        0
                    }
                }
            } else {
                println!("Error during the visit request: {}", response.status());
                0
            }
        }
        Err(err) => {
            println!("POST request failed in get_visit_request: {}", err);
            0
        }
    }
}

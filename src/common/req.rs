use reqwest::Client;
use serde_json::json;

pub async fn post_visit_request(project_id: String) -> i64 {
    let client = Client::new();
    let url = "http://127.0.0.1:3002/visit".to_string();

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
            println!("POST request failed: {}", err);
            0
        }
    }
}

pub async fn get_visit_request(project_id: String) -> i64 {
    let client = Client::new();
    let url = format!("http://127.0.0.1:3002/visit/{}", project_id);

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
            println!("POST request failed: {}", err);
            0
        }
    }
}

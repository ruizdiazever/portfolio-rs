use serde_json::Value;
use std::fs;

pub fn get_vector_from_json_file(key: &str) -> Vec<String> {
    let json_content = match fs::read_to_string("src/common/tags.json") {
        Ok(content) => content,
        Err(_) => return Vec::new(),
    };

    let json_value: Value = match serde_json::from_str(&json_content) {
        Ok(value) => value,
        Err(_) => return Vec::new(),
    };

    if let Some(Value::Array(array)) = json_value.get(key) {
        array
            .iter()
            .filter_map(|v| v.as_str().map(String::from))
            .collect()
    } else {
        Vec::new()
    }
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Payload {
    pub id: String,
    pub title: String,
    pub reaction: u8,
    pub msg: String,
    pub language: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExtraData {
    pub ip: String,
    pub user_agent: String,
    pub os: String,
    pub device: String,
    pub browser: String,
    pub location: String,
}

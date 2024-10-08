use serde::{Deserialize, Serialize};
use uuid::Uuid;

// PROJECTS
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Project {
    pub id: Uuid,
    pub human_id: String,
    pub author: Vec<String>,
    pub home: bool,
    pub url: String,
    pub title: String,
    pub description: String,
    pub readtime: u8,
    pub tags: Vec<String>,
    pub date: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ProjectsFile {
    pub posts: Vec<Project>,
}

// BLOG
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Post {
    pub id: Uuid,
    pub author: Vec<String>,
    pub home: bool,
    pub url: String,
    pub title: String,
    pub description: String,
    pub readtime: u8,
    pub tags: Vec<String>,
    pub date: String,
    pub active: bool,
}

// Organizations using Rust
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Organization {
    pub name: String,
    pub url: String,
    pub founded: i32,
    pub industry: String,
    pub description: String,
    pub country: String,
    pub sponsor: String,
    pub market: bool,
    pub source: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct OrganizationsFile {
    pub organizations: Vec<Organization>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct BlogFile {
    pub posts: Vec<Post>,
}

// EXPERIENCE
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Experience {
    pub date: String,
    pub title: String,
    pub company: String,
    pub url: String,
    pub description: String,
    pub current: bool,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ExperienceFile {
    pub entries: Vec<Experience>,
}

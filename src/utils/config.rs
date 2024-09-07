use std::fs;
use leptos::tracing::error;
use crate::utils::models::{Project, ProjectsFile, Post, BlogFile, Experience, ExperienceFile};
use uuid::Uuid;

const PROJECTS_FILE_PATH: &str = "src/static/projects.json";
const BLOG_FILE_PATH: &str = "src/static/blog.json";
const EXPERIENCE_FILE_PATH: &str = "src/static/experience.json";

pub fn get_projects_from_json() -> Vec<Project> {
    let json_content = match fs::read_to_string(PROJECTS_FILE_PATH) {
        Ok(content) => content,
        Err(e) => {
            error!("Error reading the file {}: {}", PROJECTS_FILE_PATH, e);
            return Vec::new();
        }
    };

    let projects_file: ProjectsFile = match serde_json::from_str(&json_content) {
        Ok(pf) => pf,
        Err(e) => {
            error!("Error parsing JSON from {}: {}", PROJECTS_FILE_PATH, e);
            return Vec::new();
        }
    };

    projects_file.posts
}

pub fn get_experience_from_json() -> Vec<Experience> {
    let json_content = match fs::read_to_string(EXPERIENCE_FILE_PATH) {
        Ok(content) => content,
        Err(e) => {
            error!("Error reading the file {}: {}", EXPERIENCE_FILE_PATH, e);
            return Vec::new();
        }
    };

    let experience_file: ExperienceFile = match serde_json::from_str(&json_content) {
        Ok(pf) => pf,
        Err(e) => {
            error!("Error parsing JSON from {}: {}", EXPERIENCE_FILE_PATH, e);
            return Vec::new();
        }
    };

    experience_file.entries
}

pub fn get_posts_from_json() -> Vec<Post> {
    let json_content = match fs::read_to_string(BLOG_FILE_PATH) {
        Ok(content) => content,
        Err(e) => {
            error!("Error reading the file {}: {}", BLOG_FILE_PATH, e);
            return Vec::new();
        }
    };

    let blog_file: BlogFile = match serde_json::from_str(&json_content) {
        Ok(pf) => pf,
        Err(e) => {
            error!("Error parsing JSON from {}: {}", BLOG_FILE_PATH, e);
            return Vec::new();
        }
    };

    blog_file.posts
}

pub fn get_post_by_id(post_id: Uuid) -> Option<Post> {
    let json_content = match fs::read_to_string(BLOG_FILE_PATH) {
        Ok(content) => content,
        Err(e) => {
            error!("Error reading the file {}: {}", BLOG_FILE_PATH, e);
            return None;
        }
    };

    let blog_file: BlogFile = match serde_json::from_str(&json_content) {
        Ok(pf) => pf,
        Err(e) => {
            error!("Error parsing JSON from {}: {}", BLOG_FILE_PATH, e);
            return None;
        }
    };

    blog_file.posts.into_iter().find(|post| post.id == post_id)
}

pub fn get_project_by_id(project_id: Uuid) -> Option<Project> {
    let json_content = match fs::read_to_string(PROJECTS_FILE_PATH) {
        Ok(content) => content,
        Err(e) => {
            error!("Error reading the file {}: {}", PROJECTS_FILE_PATH, e);
            return None;
        }
    };

    let project_file: ProjectsFile = match serde_json::from_str(&json_content) {
        Ok(pf) => pf,
        Err(e) => {
            error!("Error parsing JSON from {}: {}", PROJECTS_FILE_PATH, e);
            return None;
        }
    };

    project_file.posts.into_iter().find(|post| post.id == project_id)
}
pub mod cfg;
pub mod cors;
pub mod routes;

pub mod security {
    pub mod error;
    pub mod smtp;
}

pub mod common {
    pub mod extra_data;
    pub mod html;
    pub mod ip;
    pub mod req;
    pub mod send_feedback;
    pub mod ui;
    pub mod user_agent;
}

pub mod redis {
    pub mod feedback;
    pub mod models;
    pub mod visualizations;
}

pub mod services {
    pub mod feedback;
    pub mod visualizations;
}

pub mod config;
pub mod routes;

pub mod security {
    pub mod error;
    pub mod smtp;
}

pub mod common {
    pub mod ui;
    pub mod html;
    pub mod send_feedback;
}

pub mod redis {
    pub mod feedback;
    pub mod visualizations;
}

pub mod services {
    pub mod feedback;
    pub mod visualizations;
}

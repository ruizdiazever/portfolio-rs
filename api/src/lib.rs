pub mod cfg;
pub mod cors;
pub mod routes;

pub mod security {
    pub mod error;
    pub mod smtp;
}

pub mod common {
    pub mod html;
    pub mod ip;
    pub mod req;
    pub mod send_feedback;
    pub mod ui;
}

pub mod redis {
    pub mod feedback;
    pub mod visualizations;
}

pub mod services {
    pub mod feedback;
    pub mod visualizations;
}

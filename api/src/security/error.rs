use axum::http::header::{InvalidHeaderValue, WWW_AUTHENTICATE};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use lettre::address::AddressError;
use serde_json::json;
use std::{borrow::Cow, collections::HashMap};
use tracing::error;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("You're not authorized!")]
    Unauthorized,
    #[error("User may not perform that action")]
    Forbidden,
    #[error("STD Error")]
    StdError(#[from] std::io::Error),
    #[error("Request path not found")]
    NotFound,
    #[error("Too many requests. Try again later.")]
    TooManyRequests,
    #[error("Error in the request body")]
    UnprocessableEntity {
        errors: HashMap<Cow<'static, str>, Vec<Cow<'static, str>>>,
    },
    #[error("Encountered an error trying to convert an infallible value: {0}")]
    FromRequestPartsError(#[from] std::convert::Infallible),
    #[error("Error parsing URL")]
    UrlParsingError(#[from] InvalidHeaderValue),
    #[error(transparent)]
    Anyhow(#[from] anyhow::Error),
    #[error("HTTP request error: {0}")]
    Request(#[from] reqwest::Error),
    #[error("RedisDB error")]
    RedisDbError(#[from] redis::RedisError),
    #[error("Address error")]
    AddressError(#[from] AddressError),
    #[error("Email build error")]
    LettreError(#[from] lettre::error::Error),
    #[error("Lettre transport SMTP error")]
    LettreTransError(#[from] lettre::transport::smtp::Error),
    #[error("Handlebar template error")]
    HandlebarTemplateError(#[from] handlebars::TemplateError),
    #[error("USER_AGENT_PARSER_ERROR")]
    UserAgentParserError(#[from] user_agent_parser::UserAgentParserError),
}

impl Error {
    pub fn unprocessable_entity<K, V>(errors: impl IntoIterator<Item = (K, V)>) -> Self
    where
        K: Into<Cow<'static, str>>,
        V: Into<Cow<'static, str>>,
    {
        let mut error_map = HashMap::new();

        for (key, val) in errors {
            error_map
                .entry(key.into())
                .or_insert_with(Vec::new)
                .push(val.into());
        }

        Self::UnprocessableEntity { errors: error_map }
    }

    fn status_code(&self) -> StatusCode {
        match self {
            Self::Unauthorized => StatusCode::UNAUTHORIZED,
            Self::Forbidden => StatusCode::FORBIDDEN,
            Self::NotFound => StatusCode::NOT_FOUND,
            Self::TooManyRequests => StatusCode::TOO_MANY_REQUESTS,
            Self::UnprocessableEntity { .. } => StatusCode::UNPROCESSABLE_ENTITY,
            Self::UserAgentParserError(_) => StatusCode::BAD_REQUEST,
            Self::Request(_) | Self::LettreTransError(_) => StatusCode::BAD_GATEWAY,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let status = self.status_code();

        if status.is_server_error() {
            error!(error = ?self, "Request failed");
        }

        if let Self::UnprocessableEntity { errors } = &self {
            return (status, Json(json!({ "error": { "errors": errors } }))).into_response();
        }

        let public_error = if status.is_server_error() {
            "Internal server error".to_string()
        } else {
            self.to_string()
        };

        if status == StatusCode::UNAUTHORIZED {
            return (
                status,
                [(WWW_AUTHENTICATE, "Access token")],
                Json(json!({ "error": public_error })),
            )
                .into_response();
        }

        (status, Json(json!({ "error": public_error }))).into_response()
    }
}

#[cfg(test)]
mod tests {
    use super::Error;
    use axum::http::StatusCode;
    use axum::response::IntoResponse;

    #[tokio::test]
    async fn internal_errors_do_not_leak_details() {
        let response = Error::Anyhow(anyhow::anyhow!("database password leaked")).into_response();
        assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);

        let body = axum::body::to_bytes(response.into_body(), 1024)
            .await
            .expect("body");
        let body = String::from_utf8(body.to_vec()).expect("utf8");
        assert_eq!(body, r#"{"error":"Internal server error"}"#);
    }

    #[test]
    fn validation_errors_keep_their_status() {
        let error = Error::unprocessable_entity([("message", "Required")]);
        assert_eq!(error.status_code(), StatusCode::UNPROCESSABLE_ENTITY);
    }
}

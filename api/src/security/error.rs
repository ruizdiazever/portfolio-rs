use axum::http::header::{InvalidHeaderValue, WWW_AUTHENTICATE};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
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
}

// REST (does not apply to graphql)
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
            Self::Anyhow(_) => StatusCode::INTERNAL_SERVER_ERROR,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

// REST (does not apply to graphql)
impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let status = self.status_code();
        match self {
            // UnprocessableEntity
            Self::UnprocessableEntity { errors } => {
                error!("UnprocessableEntity error");
                #[derive(serde::Serialize)]
                struct Errors {
                    errors: HashMap<Cow<'static, str>, Vec<Cow<'static, str>>>,
                }
                let payload = json!({"error": Errors { errors }});
                return (StatusCode::UNPROCESSABLE_ENTITY, Json(payload)).into_response();
            }
            // Unauthorized
            Self::Unauthorized => {
                error!("Unauthorized error");
                let payload = json!({"Unauthorized": self.to_string()});
                return (
                    self.status_code(),
                    [(WWW_AUTHENTICATE, "Access token")],
                    Json(payload),
                )
                    .into_response();
            }
            // Forbidden
            Self::Forbidden => {
                error!("Forbidden error");
            }
            // NotFound
            Self::NotFound => {
                error!("NotFound error");
            }
            // Anyhow
            Self::Anyhow(ref e) => {
                error!("Generic error: {:?}", e);
            }
            // Request
            Self::Request(ref e) => {
                error!("Request error: {:?}", e);
            }
            // FromRequestPartsError
            Self::FromRequestPartsError(ref e) => {
                error!("FromRequestPartsError error: {:?}", e);
            }
            // FromRequestPartsError
            Self::StdError(ref e) => {
                error!("FromRequestPartsError error: {:?}", e);
            }
            // Others
            _ => {
                return (self.status_code(), Json(json!({"error": self.to_string()})))
                    .into_response()
            }
        }
        (status, Json(json!({"error": self.to_string()}))).into_response()
    }
}

use crate::common::ip::{get_client_ip, MetadataSession};
use crate::redis::visualizations::{get_visit, sum_visit};
use crate::routes::{ApiContext, Result};
use crate::security::error::Error;
use axum::extract::{ConnectInfo, Path, State};
use axum::http::HeaderMap;
use axum::{
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, time::Duration};
use uuid::Uuid;

#[derive(Serialize)]
struct VisitCount {
    project_id: Uuid,
    visits: i64,
}

#[derive(Deserialize)]
struct ProjectId {
    project_id: Uuid,
}

#[derive(Serialize)]
struct SuccessResponse {
    success: bool,
    visits: i64,
}

async fn post_visit(
    State(ctx): State<ApiContext>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(payload): Json<ProjectId>,
) -> Result<Json<SuccessResponse>, Error> {
    let user_agent = headers
        .get("User-Agent")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("Unknown Agent")
        .to_string();
    let ip_address = get_client_ip(&headers, peer.ip());

    if !ctx
        .rate_limiter
        .check(&ip_address, "visit", 120, Duration::from_secs(60))
    {
        return Err(Error::TooManyRequests);
    }

    let meta = &MetadataSession {
        user_agent,
        ip_address,
    };

    let result = sum_visit(&ctx, payload.project_id, meta).await?;
    Ok(Json(SuccessResponse {
        success: true,
        visits: result,
    }))
}

async fn get_visit_count(
    State(ctx): State<ApiContext>,
    Path(project_id): Path<Uuid>,
) -> Result<Json<VisitCount>, Error> {
    let visits = get_visit(&ctx, project_id).await?;
    Ok(Json(VisitCount { project_id, visits }))
}

pub fn visit_routes() -> Router<ApiContext> {
    Router::new()
        .route("/visit", post(post_visit))
        .route("/visit/{project_id}", get(get_visit_count))
}

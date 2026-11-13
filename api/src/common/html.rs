use crate::cfg::ConfigPortfolio;
use crate::redis::models::{ExtraData, Payload};
use crate::security::error::Error;
use handlebars::Handlebars;
use serde_json::json;
use serde_json::map::Map as JsonMap;
use std::sync::OnceLock;

const TEMPLATE: &str = include_str!("../assets/html/feedback.html");

static HANDLEBARS: OnceLock<Result<Handlebars<'static>, String>> = OnceLock::new();

fn handlebars() -> Result<&'static Handlebars<'static>, Error> {
    match HANDLEBARS.get_or_init(|| {
        let mut handlebars = Handlebars::new();
        handlebars
            .register_template_string("template", TEMPLATE)
            .map_err(|error| format!("failed to compile feedback template: {error}"))?;
        Ok(handlebars)
    }) {
        Ok(handlebars) => Ok(handlebars),
        Err(error) => Err(Error::Anyhow(anyhow::anyhow!(error.clone()))),
    }
}

fn reaction_path(reaction: &u8) -> &'static str {
    match reaction {
        1 => "https://s3.berli.app/portfolio/v1/feedback/reaction-sad.png",
        2 => "https://s3.berli.app/portfolio/v1/feedback/reaction-neutral.png",
        3 => "https://s3.berli.app/portfolio/v1/feedback/reaction-happy.png",
        4 => "https://s3.berli.app/portfolio/v1/feedback/reaction-love.png",
        _ => "https://s3.berli.app/portfolio/v1/feedback/reaction-default.png",
    }
}

pub fn render_feedback_template(
    config: &ConfigPortfolio,
    feedback: &Payload,
    extra: &ExtraData,
) -> Result<String, Error> {
    let mut data_map = JsonMap::new();
    data_map.insert("id".to_string(), json!(feedback.id));
    data_map.insert("title".to_string(), json!(feedback.title));
    data_map.insert(
        "reaction_path".to_string(),
        json!(reaction_path(&feedback.reaction)),
    );
    data_map.insert("reaction".to_string(), json!(feedback.reaction));
    data_map.insert("msg".to_string(), json!(feedback.msg));
    data_map.insert("language".to_string(), json!(feedback.language));
    data_map.insert("location".to_string(), json!(extra.location));
    data_map.insert("browser".to_string(), json!(extra.browser));
    data_map.insert("device".to_string(), json!(extra.device));
    data_map.insert("os".to_string(), json!(extra.os));
    data_map.insert("logo_url".to_string(), json!(config.logo));

    handlebars()?
        .render("template", &data_map)
        .map_err(|error| Error::Anyhow(anyhow::anyhow!("failed to render feedback: {error}")))
}

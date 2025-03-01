use crate::redis::models::{ExtraData, Payload};
use crate::security::error::Error;
use handlebars::Handlebars;
use serde_json::json;
use serde_json::map::Map as JsonMap;
use std::fs::File;
use std::io::prelude::Read;

fn reaction_path(reaction: &u8) -> String {
    match reaction {
        1 => "https://www.everdev.it/assets/emojis/1.png".to_string(),
        2 => "https://www.everdev.it/assets/emojis/2.png".to_string(),
        3 => "https://www.everdev.it/assets/emojis/3.png".to_string(),
        4 => "https://www.everdev.it/assets/emojis/4.png".to_string(),
        _ => "https://www.everdev.it/assets/emojis/0.png".to_string(),
    }
}

pub async fn render_feedback_template(
    feedback: &Payload,
    extra: &ExtraData,
) -> Result<String, Error> {
    // New engine of Handlebars
    let mut handlebars = Handlebars::new();
    let path = "src/assets/html/feedback.html".to_string();

    // URL LOGO
    let logo = std::env::var("LOGO").expect("Define LOGO in your .env");

    // Read your HTML
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    // Registry template with Handlebars
    handlebars.register_template_string("template", contents)?;

    // Data
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
    data_map.insert("logo_url".to_string(), json!(logo));

    // Rendering the template
    match handlebars.render("template", &data_map) {
        Ok(output) => Ok(output),
        Err(_) => Err(Error::Forbidden),
    }
}

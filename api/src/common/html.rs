use crate::security::error::Error;
use handlebars::Handlebars;
use std::fs::File;
use std::io::prelude::Read;

pub async fn html_render_template(value: &String, reaction: &String, path_html: String) -> Result<String, Error> {
    // New engine of Handlebars
    let mut handlebars = Handlebars::new();

    // Read your HTML
    let mut file = File::open(path_html)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    // Rgistry template with Handlebars
    handlebars.register_template_string("template", contents)?;

    // Data
    let mut data = serde_json::map::Map::new();
    data.insert("value".to_string(), serde_json::json!(value));
    data.insert("reaction".to_string(), serde_json::json!(reaction));

    // Rendering the template
    match handlebars.render("template", &data) {
        Ok(output) => Ok(output),
        Err(_) => Err(Error::Anyhow(anyhow::anyhow!("Email was not validated"))),
    }
}

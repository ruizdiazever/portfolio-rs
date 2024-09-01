use axum::{http::StatusCode, response::Html};

pub async fn homepage() -> Result<Html<String>, StatusCode> {
    let version = std::env::var("API_VERSION").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let html_content = format!(
        r#"
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Portfolio WASM API</title>
            <style>
                body {{
                    margin: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #0a0a0a;
                    color: #ffffff;
                    font-family: Arial, sans-serif;
                }}

                .card {{
                    background-color: #000000;
                    padding: 20px;
                    border-radius: 10px;
                    border: 1px solid #242424;
                    text-align: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    max-width: 350px;
                    width: 100%;
                    min-height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }}

                .status {{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 15px;
                }}

                .status .dot {{
                    height: 10px;
                    width: 10px;
                    background-color: #4CAF50;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 10px;
                }}

                h1, p {{
                    margin: 10px 0;
                }}

                p, code {{
                    color: #a1a1a1;
                }}

                #status {{
                    color: #4caf50;
                }}
            </style>
        </head>
        <body>
            <div class="card">
                <div class="status">
                    <span class="dot"></span>
                    <span id="status">All system normal</span>
                </div>
                <h1>Portfolio WASM API</h1>
                <p>Powered by Rust and GNU/Linux</p>
                <p>🦀</p>
                <code>{}</code>
            </div>
        </body>
        </html>
        "#,
        version
    );
    Ok(Html(html_content))
}

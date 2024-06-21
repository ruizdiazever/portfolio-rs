use tracing::info;
use tikv_client::RawClient;

async fn initialize_states() -> Result<(), Box<dyn std::error::Error>> {
    let client = RawClient::new(vec!["127.0.0.1:2379"]).await?;

    let initial_states = vec![
        ("post:portfolio:view_count", "0"),
        ("post:cookies_rust:view_count", "0"),
    ];

    info!("Inserting initial states in TiKV");
    for (key, value) in initial_states {
        if let None = client.get(key.to_owned()).await? {
            client.put(key.to_owned(), value.to_owned()).await?;
            println!("Key {} set to value {}.", key, value);
        } else {
            println!("Key {} already exists.", key);
        }
    }

    info!("Initial states have been checked and set if necessary.");

    Ok(())
}

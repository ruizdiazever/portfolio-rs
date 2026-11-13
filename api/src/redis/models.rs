use crate::security::error::Error;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Language {
    En,
    Zh,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Payload {
    pub id: Uuid,
    pub title: String,
    pub reaction: u8,
    pub msg: String,
    pub language: Language,
}

impl Payload {
    pub fn validate(&self) -> Result<(), Error> {
        let title = self.title.trim();
        if title.is_empty() || title.chars().count() > 200 {
            return Err(Error::unprocessable_entity([(
                "title",
                "Title must be between 1 and 200 characters",
            )]));
        }

        let message = self.msg.trim();
        if message.is_empty() || message.chars().count() > 500 {
            return Err(Error::unprocessable_entity([(
                "msg",
                "Feedback must be between 1 and 500 characters",
            )]));
        }

        if !(1..=4).contains(&self.reaction) {
            return Err(Error::unprocessable_entity([(
                "reaction",
                "Reaction must be between 1 and 4",
            )]));
        }

        if title.chars().any(char::is_control) {
            return Err(Error::unprocessable_entity([(
                "title",
                "Title contains unsupported characters",
            )]));
        }

        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExtraData {
    pub ip: String,
    pub user_agent: String,
    pub os: String,
    pub device: String,
    pub browser: String,
    pub location: String,
}

#[cfg(test)]
mod tests {
    use super::{Language, Payload};
    use uuid::Uuid;

    fn payload() -> Payload {
        Payload {
            id: Uuid::nil(),
            title: "A post".into(),
            reaction: 4,
            msg: "Useful".into(),
            language: Language::En,
        }
    }

    #[test]
    fn accepts_a_valid_payload() {
        assert!(payload().validate().is_ok());
    }

    #[test]
    fn rejects_an_empty_message() {
        let mut payload = payload();
        payload.msg = "   ".into();
        assert!(payload.validate().is_err());
    }

    #[test]
    fn rejects_an_out_of_range_reaction() {
        let mut payload = payload();
        payload.reaction = 0;
        assert!(payload.validate().is_err());
    }
}

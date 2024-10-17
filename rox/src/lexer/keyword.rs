use super::token_kind::TokenKind;
use std::collections::HashMap;
use std::sync::OnceLock;

pub type Keywords = HashMap<String, TokenKind>;

static DEFAULT_KEYWORDS: OnceLock<Keywords> = OnceLock::new();

pub fn get_default_keywords() -> &'static Keywords {
    DEFAULT_KEYWORDS.get_or_init(|| {
        let mut m = HashMap::new();
        m.insert("and".to_string(), TokenKind::And);
        m.insert("class".to_string(), TokenKind::Class);
        m.insert("else".to_string(), TokenKind::Else);
        m.insert("false".to_string(), TokenKind::False);
        m.insert("fun".to_string(), TokenKind::Fun);
        m.insert("for".to_string(), TokenKind::For);
        m.insert("if".to_string(), TokenKind::If);
        m.insert("nil".to_string(), TokenKind::Nil);
        m.insert("or".to_string(), TokenKind::Or);
        m.insert("print".to_string(), TokenKind::Print);
        m.insert("return".to_string(), TokenKind::Return);
        m.insert("super".to_string(), TokenKind::Super);
        m.insert("this".to_string(), TokenKind::This);
        m.insert("true".to_string(), TokenKind::True);
        m.insert("var".to_string(), TokenKind::Var);
        m.insert("while".to_string(), TokenKind::While);
        m
    })
}

// Combine keywords from local storage with default keywords
pub fn combine_keywords(local_keywords_json: Option<&str>) -> Keywords {
    let mut keywords = get_default_keywords().clone();

    if let Some(json) = local_keywords_json {
        let parsed_json: Result<Keywords, _> = serde_json::from_str(json);

        match parsed_json {
            Ok(local_keywords) => {
                for (key, value) in local_keywords {
                    keywords.insert(key, value);
                }
            }
            _ => {}
        }
    }

    keywords
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_combine_keywords_with_local_keywords() {
        // Create a stringified JSON input with local keywords
        let local_keywords_json = json!({
            "lekha": "Print",
            "sutra": "Fun",
            "klass": "Class" // Test with a new keyword
        })
        .to_string();

        // Combine keywords
        let combined_keywords = combine_keywords(Some(&local_keywords_json));

        // Assert that the combined keywords include the local ones and the default ones
        assert_eq!(combined_keywords.get("lekha"), Some(&TokenKind::Print));
        assert_eq!(combined_keywords.get("sutra"), Some(&TokenKind::Fun));
        assert_eq!(combined_keywords.get("klass"), Some(&TokenKind::Class));

        // Assert that the default keywords are still present
        assert_eq!(combined_keywords.get("and"), Some(&TokenKind::And));
        assert_eq!(combined_keywords.get("while"), Some(&TokenKind::While));
    }

    #[test]
    fn test_combine_keywords_with_no_local_keywords() {
        // Combine keywords without local keywords
        let combined_keywords = combine_keywords(None);

        // Assert that the combined keywords are the default keywords
        assert_eq!(combined_keywords.get("and"), Some(&TokenKind::And));
        assert_eq!(combined_keywords.get("class"), Some(&TokenKind::Class));
        assert_eq!(combined_keywords.get("while"), Some(&TokenKind::While));
    }

    #[test]
    fn test_combine_keywords_with_invalid_json() {
        // Combine keywords with invalid JSON
        let combined_keywords = combine_keywords(Some("invalid_json"));

        // Assert that the combined keywords are still the default keywords
        assert_eq!(combined_keywords.get("and"), Some(&TokenKind::And));
        assert_eq!(combined_keywords.get("class"), Some(&TokenKind::Class));
    }
}

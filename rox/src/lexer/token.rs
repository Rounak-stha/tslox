use super::token_kind::TokenKind;
use serde::{Deserialize, Serialize};
use std::fmt;

#[cfg_attr(test, derive(PartialEq, Eq))]
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Token {
    pub kind: TokenKind,
    pub line: usize,
    pub from: usize,
    pub to: usize,
}

impl<'de> Token {
    pub fn new(kind: TokenKind, line: usize, from: usize, to: usize) -> Token {
        Token {
            kind,
            line,
            from,
            to,
        }
    }
}

impl<'de> fmt::Display for Token {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{:?} Line: {} {} {}",
            self.kind, self.line, self.from, self.to
        )
    }
}

#[test]
fn test_token_display() {
    let token = Token::new(TokenKind::Identifier, 1, 0, 3);
    assert_eq!(format!("{}", token), "Identifier 1 0 3");
}

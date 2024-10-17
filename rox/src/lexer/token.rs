use super::token_kind::TokenKind;
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TokenLiteral<'de> {
    Number(f64),
    String(&'de str),
}

#[derive(Debug, Clone, Copy)]
pub struct Token<'de> {
    pub kind: TokenKind,
    pub lexeme: &'de str,
    pub literal: Option<TokenLiteral<'de>>,
    pub line: usize,
    pub from: usize,
    pub to: usize,
}

impl<'de> Token<'de> {
    pub fn new(
        kind: TokenKind,
        lexeme: &'de str,
        literal: Option<TokenLiteral<'de>>,
        line: usize,
        from: usize,
        to: usize,
    ) -> Token<'de> {
        Token {
            kind,
            lexeme,
            literal,
            line,
            from,
            to,
        }
    }
}

impl<'de> fmt::Display for Token<'de> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let literal = match self.literal {
            Some(l) => match l {
                TokenLiteral::Number(n) => n.to_string(),
                TokenLiteral::String(s) => s.to_string(),
            },
            None => "Null".to_string(),
        };
        write!(f, "{:?} {} {}", self.kind, self.lexeme, literal)
    }
}

#[test]
fn test_token_display() {
    let token = Token::new(TokenKind::Identifier, "let", None, 1, 0, 3);
    assert_eq!(format!("{}", token), "Identifier let Null");
}

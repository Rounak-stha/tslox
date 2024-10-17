mod keyword;
mod reader;

pub mod token;
pub mod token_kind;

use crate::{ast::expression::Literal, lox_error::LoxError};
use keyword::{combine_keywords, get_default_keywords, Keywords};
use reader::Reader;
use token::{Token, TokenLiteral};
use token_kind::TokenKind;

/**
 * TODOs:
 * HANDLE_ERROR
 */

pub struct Lexer<'de> {
    source: &'de str,
    reader: Reader<'de>,
    pub tokens: Vec<Token<'de>>,
    keywords: Keywords,
    errors: Vec<LoxError>,
}

pub enum MultiCharToken {
    String,
    Number,
    Ident,
    Slash,
    IfEqualElse(TokenKind, TokenKind),
}

impl<'de> Lexer<'de> {
    pub fn new(source: &'de str) -> Self {
        Lexer {
            source,
            reader: Reader::new(source),
            tokens: Vec::new(),
            keywords: get_default_keywords().clone(),
            errors: Vec::new(),
        }
    }
    /// Create a new lexer with custom keywords
    /// Since custom keywords are stored in localstorage as string, they are get and passed as is
    /// the lexer will do the parsing of the string to get the keywords
    pub fn new_with_keywords(source: &'de str, keywords: Option<&str>) -> Self {
        Lexer {
            source,
            reader: Reader::new(source),
            tokens: Vec::new(),
            keywords: combine_keywords(keywords),
            errors: Vec::new(),
        }
    }

    fn add_error(&mut self, error: LoxError) {
        self.errors.push(error);
    }

    pub fn has_errors(&self) -> bool {
        self.errors.len() > 0
    }

    pub fn report_errors(&self) {
        for error in &self.errors {
            eprintln!("{}", error);
        }
    }

    fn add_token(&mut self, kind: TokenKind) {
        self.add_new_token(kind, None);
    }

    fn add_token_with_literal(&mut self, kind: TokenKind, literal: TokenLiteral<'de>) {
        self.add_new_token(kind, Some(literal));
    }

    fn add_new_token(&mut self, kind: TokenKind, literal: Option<TokenLiteral<'de>>) {
        let lexeme = &self.source[self.reader.start..self.reader.cursor];
        self.tokens.push(Token::new(
            kind,
            lexeme,
            literal,
            self.reader.line,
            self.reader.start,
            self.reader.cursor,
        ));
        self.reader.sync();
    }

    fn handleMultiCharToken(&mut self, token: MultiCharToken) {
        match token {
            MultiCharToken::IfEqualElse(if_token, else_token) => {
                let kind = if self.reader.peek() == Some(&'=') {
                    self.reader.advance();
                    if_token
                } else {
                    else_token
                };
                self.add_token(kind);
            }
            MultiCharToken::String => self.scan_string(),
            MultiCharToken::Number => self.scan_number(),
            MultiCharToken::Ident => self.scan_identifier(),
            MultiCharToken::Slash => self.handle_slash(),
        }
    }

    fn handle_slash(&mut self) {
        if self.reader.peek() == Some(&'/') {
            while self.reader.peek() != Some(&'\n') && self.reader.peek() != None {
                self.reader.advance();
            }
        } else {
            self.add_token(TokenKind::Slash);
        }
    }

    fn scan_string(&mut self) {
        while let Some(c) = self.reader.advance() {
            if c == '"' {
                let literal = TokenLiteral::String(
                    &self.source[self.reader.start + 1..self.reader.cursor - 1],
                );
                self.add_token_with_literal(TokenKind::String, literal);
                return;
            }
        }
        self.add_error(LoxError::new(
            self.reader.line,
            format!("[Line {}]: Unterminated string", self.reader.line),
        ));
    }

    fn scan_number(&mut self) {
        let closure = |c: char| c.is_numeric();
        self.reader.advance_while(closure);
        if self.reader.peek() == Some(&'.') {
            self.reader.advance_while(closure);
        }

        // NOTE: HANDLE_ERROR
        let literal = TokenLiteral::Number(
            self.source[self.reader.start..self.reader.cursor]
                .parse::<f64>()
                .unwrap(),
        );

        self.add_token_with_literal(TokenKind::Number, literal);
    }

    fn scan_identifier(&mut self) {
        self.reader
            .advance_while(|c: char| c.is_alphanumeric() || c == '_');
        let literal = &self.source[self.reader.start..self.reader.cursor];

        let mut kind = TokenKind::Identifier;

        if get_default_keywords().contains_key(literal) {
            kind = self.keywords[literal];
        }

        self.add_token(kind);
    }

    pub fn scan_tokens(&mut self) {
        while let Some(c) = self.reader.advance() {
            match c {
                ' ' | '\r' | '\t' | '\n' => self.reader.sync(),
                '(' => self.add_token(TokenKind::LeftParen),
                ')' => self.add_token(TokenKind::RightParen),
                '{' => self.add_token(TokenKind::LeftBrace),
                '}' => self.add_token(TokenKind::RightBrace),
                ',' => self.add_token(TokenKind::Comma),
                '.' => self.add_token(TokenKind::Dot),
                '-' => self.add_token(TokenKind::Minus),
                '+' => self.add_token(TokenKind::Plus),
                ';' => self.add_token(TokenKind::Semicolon),
                '*' => self.add_token(TokenKind::Star),

                '/' => self.handleMultiCharToken(MultiCharToken::Slash),
                '"' => self.handleMultiCharToken(MultiCharToken::String),
                '0'..='9' => self.handleMultiCharToken(MultiCharToken::Number),
                'a'..='z' | 'A'..='Z' | '_' => self.handleMultiCharToken(MultiCharToken::Ident),

                '!' => self.handleMultiCharToken(MultiCharToken::IfEqualElse(
                    TokenKind::BangEqual,
                    TokenKind::Bang,
                )),
                '=' => self.handleMultiCharToken(MultiCharToken::IfEqualElse(
                    TokenKind::EqualEqual,
                    TokenKind::Equal,
                )),
                '<' => self.handleMultiCharToken(MultiCharToken::IfEqualElse(
                    TokenKind::LessEqual,
                    TokenKind::Less,
                )),
                '>' => self.handleMultiCharToken(MultiCharToken::IfEqualElse(
                    TokenKind::GreaterEqual,
                    TokenKind::Greater,
                )),

                _ => {
                    self.add_error(LoxError::new(
                        self.reader.line,
                        format!("[Line {}]: Unexpected character: '{}'", self.reader.line, c),
                    ));
                }
            }
        }
        self.add_token(TokenKind::Eof);
    }
}

#[cfg(test)]
mod tests {

    use super::*;
    use token_kind::TokenKind;

    #[test]
    fn test_scan_tokens() {
        let mut lexer = Lexer::new("(){},.-+;*!=>=<===/=><!//");
        lexer.scan_tokens();
        let tokens = lexer.tokens;
        assert_eq!(tokens.len(), 20);
        assert_eq!(tokens[0].kind, TokenKind::LeftParen);
        assert_eq!(tokens[1].kind, TokenKind::RightParen);
        assert_eq!(tokens[2].kind, TokenKind::LeftBrace);
        assert_eq!(tokens[3].kind, TokenKind::RightBrace);
        assert_eq!(tokens[4].kind, TokenKind::Comma);
        assert_eq!(tokens[5].kind, TokenKind::Dot);
        assert_eq!(tokens[6].kind, TokenKind::Minus);
        assert_eq!(tokens[7].kind, TokenKind::Plus);
        assert_eq!(tokens[8].kind, TokenKind::Semicolon);
        assert_eq!(tokens[9].kind, TokenKind::Star);
        assert_eq!(tokens[10].kind, TokenKind::BangEqual);
        assert_eq!(tokens[11].kind, TokenKind::GreaterEqual);
        assert_eq!(tokens[12].kind, TokenKind::LessEqual);
        assert_eq!(tokens[13].kind, TokenKind::EqualEqual);
        assert_eq!(tokens[14].kind, TokenKind::Slash);
        assert_eq!(tokens[15].kind, TokenKind::Equal);
        assert_eq!(tokens[16].kind, TokenKind::Greater);
        assert_eq!(tokens[17].kind, TokenKind::Less);
        assert_eq!(tokens[18].kind, TokenKind::Bang);
        assert_eq!(tokens[19].kind, TokenKind::Eof);
    }

    #[test]
    fn test_scan_tokens_with_string() {
        let mut lexer = Lexer::new("\"Hello, World!\";");
        lexer.scan_tokens();
        let tokens = lexer.tokens;
        print!("{tokens:?}");
        assert_eq!(tokens.len(), 3);
        assert_eq!(tokens[0].kind, TokenKind::String);
        assert_eq!(tokens[0].lexeme, "\"Hello, World!\"");
        assert_eq!(
            tokens[0].literal,
            Some(TokenLiteral::String("Hello, World!"))
        );
    }

    #[test]
    fn test_scan_arbitrary_source() {
        let source = "-2 true false nil \"Hello\"";
        let mut lexer = Lexer::new(source);
        lexer.scan_tokens();
        let tokens = lexer.tokens;

        assert_eq!(tokens.len(), 7);
        assert_eq!(tokens[0].kind, TokenKind::Minus);
        assert_eq!(tokens[1].kind, TokenKind::Number);
        assert_eq!(tokens[2].kind, TokenKind::True);
        assert_eq!(tokens[3].kind, TokenKind::False);
        assert_eq!(tokens[4].kind, TokenKind::Nil);
        assert_eq!(tokens[5].kind, TokenKind::String);
        assert_eq!(tokens[5].literal, Some(TokenLiteral::String("Hello")));
        assert_eq!(tokens[6].kind, TokenKind::Eof);
    }

    #[test]
    fn test_lexer_errors() {
        let source = "let x = 10; # $ \"I am an unterminated string";
        let mut lexer = Lexer::new(source);
        lexer.scan_tokens();

        assert_eq!(lexer.has_errors(), true);
        /*
        TODO: TEST_THESE
        let mut std_err = io::stderr();
        let mut buffer = Vec::new();
        let mut handle = std_err.lock();
        lexer.report_errors();
        io::copy(&mut handle, &mut buffer).unwrap();
        let output = String::from_utf8(buffer).unwrap();
        assert!(output.contains("[Line 1]: Unexpected character: '#'"));
        assert!(output.contains("[Line 1]: Unexpected character: '$'"));
        assert!(output.contains("[Line 1]: Unterminated string")); */
    }
}

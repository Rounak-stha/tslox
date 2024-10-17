use std::fmt::Display;

#[derive(Debug)]
pub struct LoxError {
    pub message: String,
    pub line: usize,
}

impl LoxError {
    pub fn new(line: usize, message: String) -> Self {
        Self { message, line }
    }
}

impl Display for LoxError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[line {}] Error: {}", self.line, self.message)
    }
}

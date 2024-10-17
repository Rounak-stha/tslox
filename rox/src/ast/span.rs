use crate::lexer::token::Token;

#[derive(Debug, Clone, Copy, Default)]
pub struct Span {
    pub from: usize,
    pub to: usize,
}

impl Span {
    pub fn new(from: usize, to: usize) -> Self {
        Self { from, to }
    }

    pub fn start(mut self, from: usize) -> Self {
        self.from = from;
        self
    }

    pub fn end(mut self, to: usize) -> Self {
        self.to = to;
        debug_assert!(self.from <= self.to);
        self
    }
}

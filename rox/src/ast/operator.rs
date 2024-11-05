use super::span::Span;
use serde::{Deserialize, Serialize};

#[cfg_attr(test, derive(PartialEq, Eq))]
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Operator {
    And(Span),
    Bang(Span),
    BangEqual(Span),
    EqualEqual(Span),
    Greater(Span),
    GreaterEqual(Span),
    Less(Span),
    LessEqual(Span),
    Minus(Span),
    Or(Span),
    Plus(Span),
    Slash(Span),
    Star(Span),
}

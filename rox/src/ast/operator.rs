use super::span::Span;

#[derive(Debug)]
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

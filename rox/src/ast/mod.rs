pub mod expression;
pub mod operator;
pub mod span;
pub mod statement;

use span::Span;
use statement::Statement;

pub struct Ast<'de> {
    span: Span,
    body: Vec<Statement<'de>>,
}

impl<'de> Ast<'de> {
    pub fn new(span: Span, body: Vec<Statement<'de>>) -> Self {
        Self { span, body }
    }
}

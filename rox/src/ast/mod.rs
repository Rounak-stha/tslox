pub mod expression;
pub mod operator;
pub mod span;
pub mod statement;

use bumpalo::collections::vec::Vec;
use serde::Serialize;
use span::Span;
use statement::Statement;

#[derive(Debug, Serialize)]
pub struct Ast<'alloc> {
    pub span: Span,
    pub body: Vec<'alloc, Statement<'alloc>>,
}

impl<'alloc> Ast<'alloc> {
    pub fn new(span: Span, body: Vec<'alloc, Statement<'alloc>>) -> Self {
        Self { span, body }
    }
}

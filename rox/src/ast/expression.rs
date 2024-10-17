use crate::lexer::token::Token;

use super::{operator::Operator, span::Span};

pub trait Spanned {
    fn span(&self) -> Span;
}
macro_rules! impl_spanned {
	($($t: ty),*) => {
		$(
			impl Spanned for $t {
				fn span(&self) -> Span {
					self.span.clone()
				}
			}
		)*
	}
}

#[derive(Debug)]
pub enum Expression<'de> {
    Assignment(Box<Assignment<'de>>),
    Binary(Box<Binary<'de>>),
    Call(Box<Call<'de>>),
    Grouping(Box<Grouping<'de>>),
    Literal(Box<Literal<'de>>),
    Logical(Box<Logical<'de>>),
    Ternary(Box<Ternary<'de>>),
    Unary(Box<Unary<'de>>),
    Variable(Box<Variable<'de>>),
}

#[derive(Debug)]
pub struct Assignment<'de> {
    pub span: Span,
    pub name: Token<'de>,
    pub value: Expression<'de>,
}

#[derive(Debug)]
pub struct Binary<'de> {
    pub span: Span,
    pub left: Expression<'de>,
    pub right: Expression<'de>,
    pub operator: Operator,
}

#[derive(Debug)]
pub struct Call<'de> {
    pub span: Span,
    pub callee: Expression<'de>,
    pub arguments: Vec<Expression<'de>>,
    pub end_paren: Token<'de>,
}

#[derive(Debug)]
pub struct Grouping<'de> {
    pub span: Span,
    pub expression: Expression<'de>,
}

#[derive(Debug)]
pub struct Literal<'de> {
    pub span: Span,
    pub value: Token<'de>,
}

#[derive(Debug)]
pub struct Logical<'de> {
    pub span: Span,
    pub left: Expression<'de>,
    pub right: Expression<'de>,
    pub operator: Operator,
}

#[derive(Debug)]
pub struct Ternary<'de> {
    pub span: Span,
    pub condition: Expression<'de>,
    pub true_branch: Expression<'de>,
    pub false_branch: Expression<'de>,
}

#[derive(Debug)]
pub struct Unary<'de> {
    pub span: Span,
    pub right: Expression<'de>,
    pub operator: Operator,
}

#[derive(Debug)]
pub struct Variable<'de> {
    pub span: Span,
    pub name: Token<'de>,
}

impl_spanned! {
    Assignment<'_>,
    Binary<'_>,
    Call<'_>,
    Grouping<'_>,
    Literal<'_>,
    Logical<'_>,
    Ternary<'_>,
    Unary<'_>,
    Variable<'_>
}

impl<'de> Expression<'de> {
    pub fn span(&self) -> Span {
        match self {
            Expression::Assignment(assignment) => assignment.span(),
            Expression::Binary(binary) => binary.span(),
            Expression::Call(call) => call.span(),
            Expression::Grouping(grouping) => grouping.span(),
            Expression::Literal(literal) => literal.span(),
            Expression::Logical(logical) => logical.span(),
            Expression::Ternary(ternary) => ternary.span(),
            Expression::Unary(unary) => unary.span(),
            Expression::Variable(variable) => variable.span(),
        }
    }
}

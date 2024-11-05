use super::{operator::Operator, span::Span};
use crate::lexer::token::Token;
use bumpalo::boxed::Box;
use serde::{Deserialize, Serialize};

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub enum LiteralValue<'alloc> {
    String(StringLiteral<'alloc>),
    Number(NumberLiteral<'alloc>),
    Identifier(IdentifierLiteral<'alloc>),
    Boolean(BooleanLiteral),
    Nil(NilLiteral),
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct StringLiteral<'alloc> {
    pub span: Span,
    pub value: &'alloc str,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct NumberLiteral<'alloc> {
    pub span: Span,
    pub raw: &'alloc str,
    pub value: f64,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct IdentifierLiteral<'alloc> {
    pub span: Span,
    pub name: &'alloc str,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct BooleanLiteral {
    pub span: Span,
    pub value: bool,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct NilLiteral {
    pub span: Span,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
#[serde(tag = "type")]
pub enum Expression<'alloc> {
    Assignment(Box<'alloc, Assignment<'alloc>>),
    Binary(Box<'alloc, Binary<'alloc>>),
    Call(Box<'alloc, Call<'alloc>>),
    Grouping(Box<'alloc, Grouping<'alloc>>),
    Literal(Box<'alloc, Literal<'alloc>>),
    Logical(Box<'alloc, Logical<'alloc>>),
    Ternary(Box<'alloc, Ternary<'alloc>>),
    Unary(Box<'alloc, Unary<'alloc>>),
    Variable(Box<'alloc, Variable<'alloc>>),
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Assignment<'alloc> {
    pub span: Span,
    pub target: Expression<'alloc>,
    pub value: Expression<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Binary<'alloc> {
    pub span: Span,
    pub left: Expression<'alloc>,
    pub right: Expression<'alloc>,
    pub operator: Operator,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Call<'alloc> {
    pub span: Span,
    pub callee: Expression<'alloc>,
    pub arguments: Vec<Expression<'alloc>>,
    pub end_paren: Token,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Grouping<'alloc> {
    pub span: Span,
    pub expression: Expression<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Literal<'alloc> {
    pub span: Span,
    pub value: LiteralValue<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Logical<'alloc> {
    pub span: Span,
    pub left: Expression<'alloc>,
    pub right: Expression<'alloc>,
    pub operator: Operator,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Ternary<'alloc> {
    pub span: Span,
    pub condition: Expression<'alloc>,
    pub true_branch: Expression<'alloc>,
    pub false_branch: Expression<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Unary<'alloc> {
    pub span: Span,
    pub right: Expression<'alloc>,
    pub operator: Operator,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Variable<'alloc> {
    pub span: Span,
    pub name: &'alloc str,
}

impl<'alloc> Expression<'alloc> {
    pub fn span(&self) -> Span {
        match self {
            Expression::Assignment(assignment) => assignment.span,
            Expression::Binary(binary) => binary.span,
            Expression::Call(call) => call.span,
            Expression::Grouping(grouping) => grouping.span,
            Expression::Literal(literal) => literal.span,
            Expression::Logical(logical) => logical.span,
            Expression::Ternary(ternary) => ternary.span,
            Expression::Unary(unary) => unary.span,
            Expression::Variable(variable) => variable.span,
        }
    }
}

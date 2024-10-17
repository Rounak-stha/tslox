use crate::lexer::token::Token;

use super::{expression::Expression as Expr, span::Span};

pub enum Statement<'de> {
    Block(Box<Block<'de>>),
    Expression(Box<Expression<'de>>),
    Function(Box<Function<'de>>),
    If(Box<If<'de>>),
    Print(Box<Print<'de>>),
    Return(Box<Return<'de>>),
    While(Box<While<'de>>),
    Declaration(Box<Declaration<'de>>),
}
pub struct Block<'de> {
    span: Span,
    body: Statement<'de>,
}

pub struct Declaration<'de> {
    span: Span,
    name: Token<'de>,
    value: Option<Expr<'de>>,
}

pub struct Expression<'de> {
    span: Span,
    expression: Expr<'de>,
}

pub struct Function<'de> {
    span: Span,
    name: Token<'de>,
    params: Vec<Token<'de>>,
    body: Statement<'de>,
}

pub struct If<'de> {
    span: Span,
    condition: Expr<'de>,
    body: Statement<'de>,
    else_branch: Option<Statement<'de>>,
}

pub struct Print<'de> {
    span: Span,
    expression: Expr<'de>,
}

pub struct Return<'de> {
    span: Span,
    token: Token<'de>,
    value: Expr<'de>,
}

pub struct While<'de> {
    span: Span,
    condition: Expr<'de>,
    body: Statement<'de>,
}

use crate::lexer::token::Token;

use super::{expression::Expression as Expr, span::Span};
use bumpalo::{boxed::Box, collections::Vec as BumpVec};
use serde::Serialize;

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
#[serde(tag = "type")]
pub enum Statement<'alloc> {
    Block(Box<'alloc, Block<'alloc>>),
    Expression(Box<'alloc, Expression<'alloc>>),
    For(Box<'alloc, For<'alloc>>),
    Function(Box<'alloc, Function<'alloc>>),
    If(Box<'alloc, If<'alloc>>),
    Print(Box<'alloc, Print<'alloc>>),
    Return(Box<'alloc, Return<'alloc>>),
    While(Box<'alloc, While<'alloc>>),
    Declaration(Box<'alloc, Declaration<'alloc>>),
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Block<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub body: BumpVec<'alloc, Statement<'alloc>>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Declaration<'alloc> {
    #[serde(flatten)]
    pub span: Span,

    pub name: Token,
    pub value: Option<Expr<'alloc>>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Expression<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub expression: Expr<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct For<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub initializer: Option<Statement<'alloc>>,
    pub condition: Option<Expr<'alloc>>,
    pub increment: Option<Expr<'alloc>>,
    pub body: Statement<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Function<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub name: Token,
    pub params: Vec<Token>,
    pub body: Statement<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct If<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub condition: Expr<'alloc>,
    pub body: Statement<'alloc>,
    pub else_branch: Option<Statement<'alloc>>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Print<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub value: Expr<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct Return<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub value: Expr<'alloc>,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Debug, Serialize)]
pub struct While<'alloc> {
    #[serde(flatten)]
    pub span: Span,
    pub condition: Expr<'alloc>,
    pub body: Statement<'alloc>,
}

impl Statement<'_> {
    pub fn span(&self) -> Span {
        match self {
            Statement::Block(block) => block.span,
            Statement::Expression(expr) => expr.span,
            Statement::For(for_) => for_.span,
            Statement::Function(fun) => fun.span,
            Statement::If(if_) => if_.span,
            Statement::Print(print) => print.span,
            Statement::Return(ret) => ret.span,
            Statement::While(while_) => while_.span,
            Statement::Declaration(decl) => decl.span,
        }
    }
}

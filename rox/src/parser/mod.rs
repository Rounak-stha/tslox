use crate::{
    ast::{
        expression::{Assignment, Expression, Literal, Unary, Variable},
        operator::Operator,
        span::{self, Span},
    },
    lexer::{token::Token, token_kind::TokenKind, Lexer},
};

pub struct Parser<'de> {
    source: &'de str,
    lexer: Lexer<'de>,
    cursor: usize,
}

impl<'de> Parser<'de> {
    pub fn new(source: &'de str) -> Self {
        let mut lexer = Lexer::new(source);
        lexer.scan_tokens();
        Self {
            source,
            lexer,
            cursor: 0,
        }
    }

    /* pub fn parse(&self) -> Ast<'de> {
        let mut body: Vec<Statement> = Vec::new();
        self.lexer.scan_tokens();

        while let Some(token) = self.lexer.tokens.iter().next() {
            if (token.kind != TokenKind::Eof)
        }
    } */

    fn curr_token(&self) -> Token {
        self.lexer.tokens[self.cursor].clone()
    }

    fn curr_token_kind(&self) -> TokenKind {
        self.curr_token().kind
    }

    fn consume(&mut self, token: Token) {
        if self.curr_token_kind() == token.kind {
            self.cursor += 1;
        } else {
            panic!(
                "Expected {:?} but got {:?}",
                token.kind,
                self.curr_token_kind()
            );
        }
    }

    fn operator(&self) -> Operator {
        let span = Span::new(self.curr_token().from, self.curr_token().to);
        match self.curr_token_kind() {
            TokenKind::And => Operator::And(span),
            TokenKind::Bang => Operator::Bang(span),
            TokenKind::BangEqual => Operator::BangEqual(span),
            TokenKind::EqualEqual => Operator::EqualEqual(span),
            TokenKind::Greater => Operator::Greater(span),
            TokenKind::GreaterEqual => Operator::GreaterEqual(span),
            TokenKind::Less => Operator::Less(span),
            TokenKind::LessEqual => Operator::LessEqual(span),
            TokenKind::Minus => Operator::Minus(span),
            TokenKind::Or => Operator::Or(span),
            TokenKind::Plus => Operator::Plus(span),
            TokenKind::Slash => Operator::Slash(span),
            TokenKind::Star => Operator::Star(span),
            _ => panic!("Expected operator but got {:?}", self.curr_token_kind()),
        }
    }

    // To_Do
    // Pick another name for this function
    // Took this name from Oxc Parser
    fn bump_any(&mut self) {
        self.cursor += 1;
    }

    fn parse_expression(&mut self) -> Expression {
        todo!("Implement this function")
    }

    fn parse_assignment_expression(&mut self) -> Expression {
        let expr = self.parse_or_expression();
        if self.curr_token_kind() == TokenKind::Equal {
            self.bump_any();
            let right = self.parse_assignment_expression();
            if let Expression::Variable(var) = expr {
                let span = Span::new(var.span.from, right.span().to);
                let name = var.name;
                Expression::Assignment(Box::new(Assignment {
                    span,
                    name,
                    value: right,
                }))
            } else {
                todo!("Expected variable but got {:?}", 1)
            }
        } else {
            todo!("Implement this function")
        }
    }

    fn parse_or_expression(&mut self) -> Expression {
        todo!("Implement this function")
    }

    fn parse_unary_expression(&mut self) -> Expression {
        let curr_token = self.curr_token();
        let span = Span::default().start(curr_token.from);

        if matches!(curr_token.kind, TokenKind::Bang | TokenKind::Minus) {
            let operator = self.operator();
            self.bump_any();
            let right = self.parse_unary_expression();
            return Expression::Unary(Box::new(Unary {
                span: span.end(right.span().to),
                operator,
                right,
            }));
        }
        self.parse_primary_expression()
    }

    fn parse_call_expression(&mut self) -> Expression {
        let expr = self.parse_primary_expression();
        if self.curr_token_kind() == TokenKind::LeftParen {
            self.bump_any();
            let span = Span::default().start(expr.span().from);
            let mut arguments = Vec::new();
            if self.curr_token_kind() != TokenKind::RightParen {
                args.push
            }

            while self.curr_token_kind() != TokenKind::RightParen {
                arguments.push(self.parse_unary_expression());
                if self.curr_token_kind() == TokenKind::Comma {
                    self.bump_any();
                }
            }
        }
    }

    fn parse_primary_expression(&self) -> Expression {
        let curr_token = self.curr_token();

        let span = Span::new(curr_token.from, curr_token.to);
        match curr_token.kind {
            TokenKind::String
            | TokenKind::True
            | TokenKind::False
            | TokenKind::Nil
            | TokenKind::Number => Expression::Literal(Box::new(Literal {
                span,
                value: curr_token,
            })),
            TokenKind::Identifier => Expression::Variable(Box::new(Variable {
                span,
                name: curr_token,
            })),
            _ => todo!(),
        }
    }
}

#[test]
pub fn test_parser() {
    let source = "-2 true false nil \"Hello\"";
    let mut parser = Parser::new(source);
    let expression = parser.parse_unary_expression();
    println!("{:?}", expression);
    println!("{:?}", parser.lexer.tokens);
}

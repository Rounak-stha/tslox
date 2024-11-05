use crate::{
    ast::{
        expression::{
            Assignment, Binary, BooleanLiteral, Call, Expression, Grouping, Literal, LiteralValue,
            Logical, NilLiteral, NumberLiteral, StringLiteral, Unary, Variable,
        },
        operator::Operator,
        span::Span,
        statement::{
            Block, Declaration, Expression as ExpressionStatement, For, Function, If, Print,
            Return, Statement, While,
        },
        Ast,
    },
    lexer::{token::Token, token_kind::TokenKind, Lexer},
    lox_error::LoxError,
};
use bumpalo::{boxed::Box, collections::Vec as BumpVec, Bump};

pub struct Parser<'alloc> {
    allocator: &'alloc Bump,
    source: &'alloc str,
    lexer: Lexer<'alloc>,
    cursor: usize,
    errors: Vec<LoxError>,
}

impl<'alloc> Parser<'alloc> {
    pub fn new(source: &'alloc str, allocator: &'alloc Bump) -> Self {
        let mut lexer = Lexer::new(source);
        lexer.scan_tokens();
        Self {
            allocator,
            source,
            lexer,
            cursor: 0,
            errors: Vec::new(),
        }
    }

    fn alloc<T>(&self, x: T) -> Box<'alloc, T> {
        Box::new_in(x, self.allocator)
    }

    pub fn parse(&mut self) -> Result<Ast<'alloc>, Vec<LoxError>> {
        let mut body = BumpVec::new_in(&self.allocator);
        self.lexer.scan_tokens();

        if self.lexer.has_errors() {
            return Err(self.lexer.errors());
        }

        while self.curr_token_kind() != TokenKind::Eof {
            match self.parse_statement() {
                Ok(stmt) => {
                    body.push(stmt);
                }
                Err(error) => {
                    self.add_error(error);
                    self.synchronize();
                }
            }
        }

        if self.has_errors() {
            return Err(self.errors.clone());
        }

        Ok(Ast::new(Span::new(0, self.source.len() - 1), body))
    }

    fn synchronize(&mut self) {
        while (self.curr_token_kind() != TokenKind::Eof) {
            if self.curr_token_kind() == TokenKind::Semicolon {
                self.bump_any();
                return;
            }
            match self.curr_token_kind() {
                TokenKind::Class
                | TokenKind::Fun
                | TokenKind::Var
                | TokenKind::For
                | TokenKind::If
                | TokenKind::While
                | TokenKind::Print
                | TokenKind::Return => {
                    return;
                }
                _ => {
                    self.bump_any();
                }
            }
        }
    }
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

    fn has_errors(&self) -> bool {
        self.errors.len() > 0
    }

    fn report_errors(&self) {
        for error in &self.errors {
            eprintln!("{}", error);
        }
    }

    fn add_error(&mut self, error: LoxError) {
        self.errors.push(error);
    }

    fn get_literal(&self, token: Token) -> Result<LiteralValue<'alloc>, LoxError> {
        let lexeme = &self.source[token.from..token.to];
        let span = Span::new(token.from, token.to);
        match token.kind {
            TokenKind::True => Ok(LiteralValue::Boolean(BooleanLiteral { span, value: true })),
            TokenKind::False => Ok(LiteralValue::Boolean(BooleanLiteral { span, value: false })),
            TokenKind::Nil => Ok(LiteralValue::Nil(NilLiteral { span })),
            TokenKind::String => Ok(LiteralValue::String(StringLiteral {
                span,
                value: lexeme,
            })),
            TokenKind::Number => {
                let value = lexeme.parse::<f64>().unwrap();
                Ok(LiteralValue::Number(NumberLiteral {
                    span,
                    raw: lexeme,
                    value,
                }))
            }
            _ => Err(LoxError::new(
                token.line,
                format!("Expected literal but got {:?}", token.kind),
            )),
        }
    }

    fn operator(&self) -> Result<Operator, LoxError> {
        let span = Span::new(self.curr_token().from, self.curr_token().to);
        match self.curr_token_kind() {
            TokenKind::And => Ok(Operator::And(span)),
            TokenKind::Bang => Ok(Operator::Bang(span)),
            TokenKind::BangEqual => Ok(Operator::BangEqual(span)),
            TokenKind::EqualEqual => Ok(Operator::EqualEqual(span)),
            TokenKind::Greater => Ok(Operator::Greater(span)),
            TokenKind::GreaterEqual => Ok(Operator::GreaterEqual(span)),
            TokenKind::Less => Ok(Operator::Less(span)),
            TokenKind::LessEqual => Ok(Operator::LessEqual(span)),
            TokenKind::Minus => Ok(Operator::Minus(span)),
            TokenKind::Or => Ok(Operator::Or(span)),
            TokenKind::Plus => Ok(Operator::Plus(span)),
            TokenKind::Slash => Ok(Operator::Slash(span)),
            TokenKind::Star => Ok(Operator::Star(span)),
            _ => Err(LoxError::new(
                self.curr_token().line,
                format!("Expected operator but got {:?}", self.curr_token_kind()),
            )),
        }
    }

    fn curr_token_lexeme(&self) -> &'alloc str {
        let curr_token = self.curr_token();
        &self.source[curr_token.from..curr_token.to]
    }
    // To_Do
    // Pick another name for this function
    // Took this name from Oxc Parser
    fn bump_any(&mut self) {
        self.cursor += 1;
    }

    fn eat(&mut self, kind: TokenKind) -> Result<Token, LoxError> {
        let curr_token = self.curr_token();
        if curr_token.kind == kind {
            self.bump_any();
            Ok(curr_token)
        } else {
            Err(LoxError::new(
                self.curr_token().line,
                format!(
                    "Syntax Error: Expected {:?} but got {:?}",
                    kind,
                    self.curr_token_kind()
                ),
            ))
        }
    }

    fn parse_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        match self.curr_token_kind() {
            TokenKind::Fun => self.parse_function_declaration(),
            TokenKind::Var => self.parse_variable_declaration(),
            TokenKind::While => self.parse_while_statement(),
            TokenKind::For => self.parse_for_statement(),
            TokenKind::If => self.parse_if_statement(),
            TokenKind::Print => self.parse_print_statement(),
            TokenKind::Return => self.parse_return_statement(),
            TokenKind::LeftBrace => self.parse_block_statement(),
            _ => self.parse_expression_statement(),
        }
    }

    fn parse_function_declaration(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let fun_keyword = self.eat(TokenKind::Fun)?;
        if self.curr_token_kind() != TokenKind::Identifier {
            return Err(LoxError::new(
                self.curr_token().line,
                format!(
                    "Expected function name, got {:?}",
                    &self.source[self.curr_token().from..self.curr_token().to]
                ),
            ));
        }
        let name = self.eat(TokenKind::Identifier)?;
        self.eat(TokenKind::LeftParen)?;
        let mut params = Vec::new();

        if self.curr_token_kind() != TokenKind::RightParen {
            loop {
                let param = self.eat(TokenKind::Identifier)?;
                params.push(param);
                if self.curr_token_kind() == TokenKind::Comma {
                    self.bump_any();
                } else {
                    break;
                }
            }
        }
        self.eat(TokenKind::RightParen)?;
        let body = self.parse_block_statement()?;
        Ok(Statement::Function(Box::new_in(
            Function {
                span: Span::new(fun_keyword.from, body.span().to),
                name,
                params,
                body,
            },
            &self.allocator,
        )))
    }

    fn parse_variable_declaration(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let var_keyword = self.eat(TokenKind::Var)?;
        let name = self.eat(TokenKind::Identifier)?;
        let value = if self.curr_token_kind() == TokenKind::Equal {
            self.bump_any();
            Some(self.parse_expression()?)
        } else {
            None
        };
        let semi = self.eat(TokenKind::Semicolon)?;
        Ok(Statement::Declaration(Box::new_in(
            Declaration {
                span: Span::new(var_keyword.from, semi.to),
                name,
                value,
            },
            &self.allocator,
        )))
    }

    fn parse_while_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let while_keyword = self.eat(TokenKind::While)?;
        self.eat(TokenKind::LeftParen)?;
        let condition = self.parse_expression()?;
        self.eat(TokenKind::RightParen)?;
        let body = self.parse_block_statement()?;
        Ok(Statement::While(Box::new_in(
            While {
                span: Span::new(while_keyword.from, body.span().to),
                condition,
                body,
            },
            &self.allocator,
        )))
    }

    fn parse_for_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let for_keyword = self.eat(TokenKind::For)?;
        self.eat(TokenKind::LeftParen)?;
        let initializer = match self.curr_token_kind() {
            TokenKind::Semicolon => None,
            TokenKind::Var => Some(self.parse_variable_declaration()?),
            _ => Some(self.parse_expression_statement()?),
        };

        let condiion = if self.curr_token_kind() != TokenKind::Semicolon {
            let expr = self.parse_expression()?;
            self.eat(TokenKind::Semicolon);
            Some(expr)
        } else {
            None
        };

        let incrementor = if self.curr_token_kind() != TokenKind::RightParen {
            Some(self.parse_expression()?)
        } else {
            None
        };

        self.eat(TokenKind::RightParen)?;
        let body = self.parse_block_statement()?;
        Ok(Statement::For(Box::new_in(
            For {
                span: Span::new(for_keyword.from, body.span().to),
                initializer,
                condition: condiion,
                increment: incrementor,
                body,
            },
            &self.allocator,
        )))
    }

    fn parse_block_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let start_brace = self.eat(TokenKind::LeftBrace)?;
        let mut body = BumpVec::new_in(&self.allocator);
        while self.curr_token_kind() != TokenKind::RightBrace {
            body.push(self.parse_statement()?);
        }
        let end_brace = self.eat(TokenKind::RightBrace)?;
        let span = Span::new(start_brace.from, end_brace.to);

        Ok(Statement::Block(self.alloc(Block { span, body })))
    }

    fn parse_expression_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let expr = self.parse_expression()?;
        let semi = self.eat(TokenKind::Semicolon)?;
        Ok(Statement::Expression(self.alloc(ExpressionStatement {
            span: Span::new(expr.span().from, semi.to),
            expression: expr,
        })))
    }

    fn parse_if_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let if_keyword = self.eat(TokenKind::If)?;
        self.eat(TokenKind::LeftParen)?;
        let condition = self.parse_expression()?;
        self.eat(TokenKind::RightParen)?;
        let body = self.parse_block_statement()?;
        let else_branch = if self.curr_token_kind() == TokenKind::Else {
            self.bump_any();
            if self.curr_token_kind() == TokenKind::If {
                Some(self.parse_if_statement()?)
            } else {
                Some(self.parse_block_statement()?)
            }
        } else {
            None
        };
        Ok(Statement::If(self.alloc(If {
            span: Span::new(if_keyword.from, body.span().to),
            condition,
            body,
            else_branch,
        })))
    }

    fn parse_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        self.parse_assignment_expression()
    }

    fn parse_print_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let print_keyword = self.eat(TokenKind::Print)?;
        let expr = self.parse_expression()?;
        self.eat(TokenKind::Semicolon)?;
        Ok(Statement::Print(self.alloc(Print {
            span: Span::new(print_keyword.from, expr.span().to),
            value: expr,
        })))
    }

    fn parse_return_statement(&mut self) -> Result<Statement<'alloc>, LoxError> {
        let return_keyword = self.eat(TokenKind::Return)?;
        let expr = self.parse_expression()?;
        self.eat(TokenKind::Semicolon)?;
        Ok(Statement::Return(self.alloc(Return {
            span: Span::new(return_keyword.from, expr.span().to),
            value: expr,
        })))
    }

    fn parse_assignment_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_or_expression()?;
        if self.curr_token_kind() == TokenKind::Equal {
            self.bump_any();
            let right = self.parse_assignment_expression()?;
            if let Expression::Variable(_) = expr {
                let span = Span::new(expr.span().from, right.span().to);
                return Ok(Expression::Assignment(self.alloc(Assignment {
                    span,
                    target: expr,
                    value: right,
                })));
            } else {
                todo!("Expected variable but got {:?}", 1)
            }
        }
        Ok(expr)
    }

    fn parse_or_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_and_expression()?;

        if self.curr_token_kind() == TokenKind::Or {
            let operator = self.operator()?;
            self.bump_any();
            let right = self.parse_or_expression()?;
            return Ok(Expression::Logical(self.alloc(Logical {
                span: Span::new(expr.span().from, right.span().to),
                left: expr,
                right,
                operator,
            })));
        }
        Ok(expr)
    }

    fn parse_and_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_equality_expression()?;

        if self.curr_token_kind() == TokenKind::And {
            let operator = self.operator()?;
            self.bump_any();
            let right = self.parse_or_expression()?;
            return Ok(Expression::Logical(self.alloc(Logical {
                span: Span::new(expr.span().from, right.span().to),
                left: expr,
                right,
                operator,
            })));
        }
        Ok(expr)
    }

    fn parse_equality_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_comparison_expression()?;

        if matches!(
            self.curr_token_kind(),
            TokenKind::EqualEqual | TokenKind::BangEqual
        ) {
            let operator = self.operator()?;
            self.bump_any();
            let right = self.parse_comparison_expression()?;
            return Ok(Expression::Binary(self.alloc(Binary {
                span: Span::new(expr.span().from, right.span().to),
                left: expr,
                right,
                operator,
            })));
        }
        Ok(expr)
    }

    fn parse_comparison_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_term_expression()?;

        if matches!(
            self.curr_token_kind(),
            TokenKind::Greater | TokenKind::GreaterEqual | TokenKind::Less | TokenKind::LessEqual
        ) {
            let operator = self.operator()?;
            self.bump_any();
            let right = self.parse_term_expression()?;
            return Ok(Expression::Binary(self.alloc(Binary {
                span: Span::new(expr.span().from, right.span().to),
                left: expr,
                right,
                operator,
            })));
        }
        Ok(expr)
    }

    fn parse_term_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_factor_expression()?;
        if matches!(self.curr_token_kind(), TokenKind::Plus | TokenKind::Minus) {
            let operator = self.operator()?;
            self.bump_any();
            let right = self.parse_factor_expression()?;
            return Ok(Expression::Binary(self.alloc(Binary {
                span: Span::new(expr.span().from, right.span().to),
                left: expr,
                right,
                operator,
            })));
        }
        Ok(expr)
    }

    fn parse_factor_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_unary_expression()?;
        if matches!(self.curr_token_kind(), TokenKind::Star | TokenKind::Slash) {
            let operator = self.operator()?;
            self.bump_any();
            let right = self.parse_unary_expression()?;
            return Ok(Expression::Binary(self.alloc(Binary {
                span: Span::new(expr.span().from, right.span().to),
                left: expr,
                right,
                operator,
            })));
        }
        Ok(expr)
    }

    fn parse_unary_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let curr_token = self.curr_token();
        let span = Span::default().start(curr_token.from);

        if matches!(curr_token.kind, TokenKind::Bang | TokenKind::Minus) {
            let operator = self.operator()?;
            self.bump_any();
            let right = self.parse_unary_expression()?;
            return Ok(Expression::Unary(self.alloc(Unary {
                span: span.end(right.span().to),
                operator,
                right,
            })));
        }
        self.parse_primary_expression()
    }

    fn parse_call_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let expr = self.parse_primary_expression()?;
        if self.curr_token_kind() == TokenKind::LeftParen {
            self.bump_any();
            let span = Span::default().start(expr.span().from);
            let mut arguments = Vec::new();

            while self.curr_token_kind() == TokenKind::Comma {
                self.bump_any();
                arguments.push(self.parse_expression()?);
            }

            // if the current token is a end paren
            // return the call expression
            // else throw parse error
            if self.curr_token_kind() == TokenKind::RightParen {
                let end_paren = self.curr_token();
                self.bump_any();

                return Ok(Expression::Call(self.alloc(Call {
                    span: span.end(end_paren.to),
                    callee: expr,
                    arguments,
                    end_paren,
                })));
            } else {
                return Err(LoxError::new(
                    self.curr_token().line,
                    "Expected ')' after arguments".to_string(),
                ));
            }
        }
        Ok(expr)
    }

    fn parse_primary_expression(&mut self) -> Result<Expression<'alloc>, LoxError> {
        let curr_token = self.curr_token();
        let span = Span::new(curr_token.from, curr_token.to);

        let expr = match curr_token.kind {
            TokenKind::String
            | TokenKind::True
            | TokenKind::False
            | TokenKind::Nil
            | TokenKind::Number => Expression::Literal(self.alloc(Literal {
                span,
                value: self.get_literal(curr_token)?,
            })),
            TokenKind::Identifier => Expression::Variable(self.alloc(Variable {
                span,
                name: self.curr_token_lexeme(),
            })),
            TokenKind::LeftBrace => {
                let expr = self.parse_expression()?;
                let curr_token = self.curr_token();
                if curr_token.kind == TokenKind::RightBrace {
                    self.bump_any();
                    Expression::Grouping(self.alloc(Grouping {
                        span: Span::new(curr_token.from, curr_token.to),
                        expression: expr,
                    }));
                }
                return Err(LoxError::new(
                    curr_token.line,
                    format!(
                        "Syntax Error: Expected '}}', got {}",
                        self.curr_token_lexeme(),
                    ),
                ));
            }
            _ => Err(LoxError::new(
                curr_token.line,
                format!(
                    "Syntax Error: Expression Expected but got {}",
                    self.curr_token_lexeme(),
                ),
            ))?,
        };
        self.bump_any();
        Ok(expr)
    }
}

#[test]
pub fn test_parser() {
    let source = "-2; true false nil \"Hello\"";
    let allocator = Bump::new();
    let mut parser = Parser::new(source, &allocator);
    let ast_or_error = parser.parse();
    match ast_or_error {
        Ok(ast) => {
            println!("{:?}", ast);
            // println!("{:?}", parser.lexer.tokens);
        }
        Err(error) => {
            for err in error {
                eprint!("{}", err)
            }
        }
    }
}

#[test]
pub fn test_parse_function() {
    let source = "
		fun sum(x, y) {
			return x + y;
		}
	";
    let allocator = Bump::new();
    let mut parser = Parser::new(source, &allocator);
    let ast_or_error = parser.parse();
    match ast_or_error {
        Ok(ast) => {
            println!("{:?}", ast);
            // println!("{:?}", parser.lexer.tokens);
        }
        Err(error) => {
            for err in error {
                eprint!("{}", err)
            }
        }
    }
}

#[test]
pub fn test_variable_declaration() {
    let source = "
		var name = \"NU Name\"
	";
    let allocator = Bump::new();
    let mut parser = Parser::new(source, &allocator);
    let ast_or_error = parser.parse();
    match ast_or_error {
        Ok(ast) => {
            println!("{:?}", ast);
            // println!("{:?}", parser.lexer.tokens);
        }
        Err(error) => {
            for err in error {
                eprint!("{}", err)
            }
        }
    }
}

#[test]
pub fn test_parse_for_loop() {
    let source = "
		for (var i = 0; i < length; i = i + 1) { // currently the parser can't handle the postfix increment operator
			print i;
		}
	";

    let allocator = Bump::new();
    let mut parser = Parser::new(source, &allocator);
    let ast_or_error = parser.parse();
    assert!(matches!(ast_or_error, Ok(_)));
    let ast = ast_or_error.unwrap();
    assert_eq!(ast.body.len(), 1);
    if let Statement::For(for_struct) = &ast.body[0] {
        assert!(matches!(
            for_struct.initializer,
            Some(Statement::Declaration(_))
        ));
        assert!(matches!(for_struct.condition, Some(Expression::Binary(_))));
        assert!(matches!(
            for_struct.increment,
            Some(Expression::Assignment(_))
        ));
    } else {
        assert!(false, "Expected for loop but got {:?}", ast.body[0]);
    }
}

#[test]
pub fn test_parse_while_loop() {
    let source = "
		while (i < length) {
			print i;
		}
	";
    let allocator = Bump::new();
    let mut parser = Parser::new(source, &allocator);
    let ast_or_error = parser.parse();
    match ast_or_error {
        Ok(ast) => {
            println!("{:?}", ast);
            // println!("{:?}", parser.lexer.tokens);
        }
        Err(error) => {
            for err in error {
                eprint!("{}", err)
            }
        }
    }
}

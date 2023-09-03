import LoxError from '../error/LoxError'
import Token from '../tokenizer/Token'
import TokenType from '../tokenizer/TokenType'
import { Assignment, Binary, CallExpr, Expr, Grouping, Literal, Logical, Ternary, Unary, variable } from '../expression'
import { BlockStmt, ExpressionStmt, FunctionStmt, IfStmt, PrintStmt, ReturnStmt, Stmt, VarStmt, WhileStmt } from '../statement'
import { LoxBulkError } from '../error/LoxBulkError'

// Create a helper function to throw synyax error of this signature
// SyntaxError(Token, message): void

export type SyntaxTree = {
    type: 'Lox Program'
    from: number
    to: number
    body: Stmt[]
}

export type ParserError = LoxBulkError

export default class Parser {
    private readonly tokens: Token[]
    private currTokenIndex = 0
    private hadError = false
    errors: LoxError[] = []

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    /**
     * Throws LoxBulkError and lets the caller to handle the error
     * @returns { SyntaxTree }
     */
    parse(): SyntaxTree {
        const statements: Stmt[] = []
        while (!this.isAtEnd()) {
            try {
                statements.push(this.declaration())
            } catch (e) {
                if (e instanceof LoxError) {
                    this.hadError = true
                    this.errors.push(e)
                    this.synchronize()
                } else throw e
            }
        }
        if (this.hadError) throw new LoxBulkError('Syntax', this.errors)
        return {
            type: 'Lox Program',
            from: this.tokens[0].from,
            to: this.tokens[this.tokens.length - 1].to,
            body: statements
        }
    }

    private expression(): Expr {
        return this.assignment()
    }

    /**
     * Declaration is top level statement which calls the other statement parsers
     * If the parsers throws an error, this sets the hadError field to true and returns null
     * Else returns the parsed statement
     */
    // NOTE: Since, the start of each statement except for expression statement is indicated by a token
    // the start of statement is indicated by the token start position
    // and Ending by a semicolon except for Function Declaration and Block Statement
    private declaration(): Stmt {
        if (this.match(TokenType.FUN)) return this.funcDeclaration('function')
        if (this.match(TokenType.VAR)) return this.varDeclaration()
        return this.statement()
    }

    /**
     * Parses Statement
     * @returns Stmt
     */
    private statement() {
        if (this.match(TokenType.WHILE)) return this.whileLoop()
        if (this.match(TokenType.FOR)) return this.forLoop()
        if (this.match(TokenType.IF)) return this.ifStatement()
        if (this.match(TokenType.RETURN)) return this.returnStmt()
        if (this.match(TokenType.PRINT)) return this.printStatement()
        if (this.match(TokenType.LEFT_BRACE)) return this.blockStatement()
        return this.expressionStatement()
    }

    /**
     *
     * @param kind { function | method }
     */
    private funcDeclaration(kind: 'function' | 'method') {
        const from = this.previous().from
        const name = this.consume(TokenType.IDENTIFIER, `Expected ${kind} name.`)
        const parameters: Token[] = []
        this.consume(TokenType.LEFT_PAREN, `Expected '(' after ${kind} name.`)
        if (!this.check(TokenType.RIGHT_PAREN)) {
            parameters.push(this.consume(TokenType.IDENTIFIER, 'Expected parameter name.'))
            while (this.match(TokenType.COMMA)) {
                if (parameters.length === 255) throw new LoxError(this.peek().line, 'Parse Error', 'Maximum Arguments Length is 255')
                parameters.push(this.consume(TokenType.IDENTIFIER, 'Expected parameter name.'))
            }
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters.")
        this.consume(TokenType.LEFT_BRACE, `Expected '{' before ${kind} body.`)
        const body = this.block()
        // The this.previous() below must return the function body's closing brace token
        // which would be the ending of the function declaration
        return new FunctionStmt(name, parameters, body, from, this.previous().to)
    }

    private returnStmt(): ReturnStmt {
        const from = this.previous().from
        const token = this.previous()
        let value = null
        if (!this.check(TokenType.SEMICOLON)) {
            value = this.expression()
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after return statement")
        return new ReturnStmt(token, value, from, this.previous().to)
    }

    private varDeclaration() {
        const from = this.previous().from
        const name = this.consume(TokenType.IDENTIFIER, 'Expected Varible Name')
        let initializer: Expr | null = null
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression()
        }
        const semi = this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration")
        return new VarStmt(name, initializer, from, semi.to)
    }

    /**
     * Parse While Loop
     */
    private whileLoop(): Stmt {
        const from = this.previous().from
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after while")
        const condition: Expr = this.expression()
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after loop condition")
        const body = this.statement()
        return new WhileStmt(condition, body, from, this.previous().to)
    }

    /**
     * Parse For Loop
     */
    private forLoop(): Stmt {
        const from = this.previous().from
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'")
        let initializer: Stmt | null = null
        let condition: Expr | null = null
        let incrementer: Expr | null = null

        if (this.match(TokenType.SEMICOLON)) {
        } else {
            if (this.match(TokenType.VAR)) initializer = this.varDeclaration()
            else initializer = this.expressionStatement()
        }
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.expression()
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition")
        if (!this.check(TokenType.RIGHT_PAREN)) {
            incrementer = this.expression()
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after clauses")
        let body = this.statement()
        if (incrementer) body = new BlockStmt([body, new ExpressionStmt(incrementer, incrementer.from, incrementer.to)], body.from, incrementer.to)
        // TO-DO : The location of the literal below is not exact: Fix it
        body = new WhileStmt(condition ? condition : new Literal(true, this.previous().from, this.previous().from), body, from, body.to)
        if (initializer) body = new BlockStmt([initializer, body], from, body.to)
        return body
    }

    /**
     * Parse Block Statement
     */
    private blockStatement(): Stmt {
        const from = this.previous().from
        const block = this.block()
        return new BlockStmt(block, from, this.previous().to)
    }

    private block(): Stmt[] {
        const statements: Stmt[] = []
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration())
        }
        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block")
        return statements
    }

    /**
     * Parses If Statement
     */
    private ifStatement(): Stmt {
        const from = this.previous().from
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'if'.")
        const condition = this.expression()
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after if condition.")
        const thenBranch = this.statement()
        let elseBranch: Stmt | null = null
        if (this.match(TokenType.ELSE)) elseBranch = this.statement()
        return new IfStmt(condition, thenBranch, elseBranch, from, this.previous().to)
    }

    /**
     * Parse Print Statement
     * @returns PrintStmt
     */
    private printStatement(): Stmt {
        const from = this.previous().from
        const expression: Expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expected ';' after value")
        return new PrintStmt(expression, from, this.previous().to)
    }

    /**
     * Parse Expression Statement
     * @returns ExpressionStmt
     */
    private expressionStatement(): ExpressionStmt {
        const expression: Expr = this.expression()
        const semi = this.consume(TokenType.SEMICOLON, "Expect ';' after expression.")
        return new ExpressionStmt(expression, expression.from, semi.to)
    }

    private assignment(): Expr {
        const expr = this.or()

        if (this.match(TokenType.EQUAL)) {
            const equals = this.previous()
            const value: Expr = this.assignment()

            if (expr instanceof variable) {
                return new Assignment(expr.name, value, expr.from, value.to)
            }

            throw new LoxError(equals.line, 'Syntax', 'Invalid Assignment Target')
        }
        return expr
    }

    /**
     * Parse Logical OR
     */
    private or(): Expr {
        let expr = this.and()
        if (this.match(TokenType.OR)) {
            const operator = this.previous()
            const right = this.expression()
            expr = new Logical(expr, operator, right, expr.from, right.to)
        }
        return expr
    }

    /**
     * Parse Logical AND
     */
    private and(): Expr {
        let expr = this.ternary()
        if (this.match(TokenType.AND)) {
            const operator = this.previous()
            const right = this.expression()
            expr = new Logical(expr, operator, right, expr.from, right.to)
        }
        return expr
    }

    /**
     * Parse Ternary Expression
     * @returns Ternary
     */
    private ternary(): Expr {
        let expr: Expr = this.equality()
        let first: Expr
        let second: Expr
        if (this.match(TokenType.QUESTION_MARK)) {
            first = this.equality()
            if (!this.match(TokenType.COLON)) throw new LoxError(this.line(), 'Syntax', `':' Expected, Got '${this.currentLexeme()}'`)
            second = this.equality()
            return new Ternary(expr, first, second, expr.from, second.to)
        }
        return expr
    }

    /**
     * Parses Equality
     * @returns Binary Expression
     */
    private equality(): Expr {
        let expr: Expr = this.comparision()

        while (this.match(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL)) {
            let operator: Token = this.previous()
            let right: Expr = this.comparision()
            expr = new Binary(expr, operator, right, expr.from, right.to)
        }
        return expr
    }

    private comparision(): Expr {
        let expr: Expr = this.term()

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            let operator: Token = this.previous()
            let right: Expr = this.term()
            expr = new Binary(expr, operator, right, expr.from, right.to)
        }
        return expr
    }

    private term(): Expr {
        let expr: Expr = this.factor()

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            let operator: Token = this.previous()
            let right: Expr = this.factor()
            expr = new Binary(expr, operator, right, expr.from, right.to)
        }

        return expr
    }

    private factor(): Expr {
        let expr: Expr = this.unary()

        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            let operator: Token = this.previous()
            let right: Expr = this.unary()
            expr = new Binary(expr, operator, right, expr.from, right.to)
        }

        return expr
    }

    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            let operator: Token = this.previous()
            let right: Expr = this.unary()
            return new Unary(operator, right, operator.from, right.to)
        }

        return this.call()
    }

    private call(): Expr {
        let expr = this.primary()
        while (this.match(TokenType.LEFT_PAREN)) {
            expr = this.parseCall(expr)
        }
        return expr
    }

    private parseCall(callee: Expr): CallExpr {
        const from = callee.from
        const args: Expr[] = []
        if (!this.check(TokenType.RIGHT_PAREN)) {
            args.push(this.primary())
        }
        while (this.match(TokenType.COMMA)) {
            args.push(this.expression())
            if (args.length > 2) throw new LoxError(this.peek().line, 'Parse Error', 'Maximum Arguments Length is 255')
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments")
        const to = this.previous().to
        return new CallExpr(callee, args, this.previous(), from, to)
    }

    private primary(): Expr {
        const token = this.peek()
        const from = token.from
        const to = token.to

        if (this.match(TokenType.FALSE)) return new Literal(false, from, to)
        if (this.match(TokenType.TRUE)) return new Literal(true, from, to)
        if (this.match(TokenType.NIL)) return new Literal(null, from, to)

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(token.literal, from, to)
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            let expr: Expr = this.expression()
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
            return new Grouping(expr, from, to)
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return new variable(token, from, to)
        }
        throw new LoxError(this.previous().line, 'Syntax', `Expression Expected, Got '${this.currentLexeme()}'`)
    }

    private currentLexeme(): string {
        return this.tokens[this.currTokenIndex].lexeme
    }

    private line(): number {
        return this.tokens[this.currTokenIndex].line
    }

    /**
     * Matches the current Token pointed by the cursor with the Tokens passed
     * Advances the cursor if it's a match (Consumes the token)
     */
    private match(...types: TokenType[]): boolean {
        for (let type of types) {
            if (this.check(type)) {
                this.advance()
                return true
            }
        }
        return false
    }

    /**
     * Checks if the given Token type is the current Token type pointed
     * to by the cursor
     */
    private check(tokenType: TokenType): boolean {
        if (this.isAtEnd()) return false
        return this.peek().type === tokenType
    }

    /**
     * Consumes the current Token pointed to by the cursor and
     * increments the cursor
     */
    private advance(): Token {
        if (!this.isAtEnd()) this.currTokenIndex++
        return this.previous()
    }

    /**
     * Returns the previous Token
     */
    private previous(): Token {
        return this.tokens[this.currTokenIndex - 1]
    }

    /**
     * COnsume expects the token passed to be the token at the current cursor index
     * Else throws a syntax error
     */
    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance()
        throw new LoxError(this.previous().line, 'Syntax', message)
    }

    /**
     * Peeks the current token and returns it
     * @returns Current Token
     */
    private peek(): Token {
        return this.tokens[this.currTokenIndex]
    }

    /**
     * Checks if the cursor reached the end of the Token List
     */
    private isAtEnd() {
        return this.peek().type === TokenType.EOF
    }

    private synchronize(): void {
        // this.advance()

        while (!this.isAtEnd()) {
            switch (this.peek().type) {
                case TokenType.SEMICOLON:
                    this.advance()
                    return
                case TokenType.CLASS:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return
            }
            this.advance()
        }
    }
}

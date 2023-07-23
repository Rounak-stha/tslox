import LoxError from '../error/LoxError'
import Token from '../tokenizer/Token'
import TokenType from '../tokenizer/TokenType'
import { Assignment, Binary, Expr, Grouping, Literal, Ternary, Unary, variable } from '../expression'
import { ExpressionStmt, PrintStmt, Stmt, VarStmt } from '../statement'

// Create a helper function to throw synyax error of this signature
// SyntaxError(Token, message): void

export default class Parser {
    private readonly tokens: Token[]
    private currTokenIndex = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse(): Stmt[] {
        const statements: Stmt[] = []
        while (!this.isAtEnd()) {
            statements.push(this.declaration())
        }
        return statements
    }

    private expression(): Expr {
        return this.assignment()
    }

    /**
     * Parses Statement
     * @returns Stmt
     */
    private statement() {
        if (this.match(TokenType.PRINT)) return this.printStatement()
        return this.expressionStatement()
    }

    private declaration(): Stmt {
        if (this.match(TokenType.VAR)) return this.varDeclaration()
        return this.statement()
    }

    private varDeclaration() {
        const name = this.consume(TokenType.IDENTIFIER, 'Expected Varible Name')
        let initializer: Expr | null = null
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression()
        }
        this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration")
        return new VarStmt(name, initializer)
    }

    /**
     * Parse Print Statement
     * @returns PrintStmt
     */
    private printStatement(): Stmt {
        const expression: Expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expected ';' after value")
        return new PrintStmt(expression)
    }

    /**
     * Parse Expression Statement
     * @returns ExpressionStmt
     */
    private expressionStatement(): ExpressionStmt {
        const expression: Expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.")
        return new ExpressionStmt(expression)
    }

    private assignment(): Expr {
        const expr = this.ternary()

        if (this.match(TokenType.EQUAL)) {
            const equals = this.previous()
            const value: Expr = this.ternary()

            if (expr instanceof variable) {
                return new Assignment(expr.name, value)
            }

            throw new LoxError(equals.line, 'Syntax', 'Invalid Assignment Target')
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
            if (!this.match(TokenType.COLON))
                throw new LoxError(this.line(), 'Syntax', `':' Expected, Got '${this.currentLexeme()}'`)
            second = this.equality()
            return new Ternary(expr, first, second)
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
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    private comparision(): Expr {
        let expr: Expr = this.term()

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            let operator: Token = this.previous()
            let right: Expr = this.term()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    private term(): Expr {
        let expr: Expr = this.factor()

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            let operator: Token = this.previous()
            let right: Expr = this.factor()
            expr = new Binary(expr, operator, right)
        }

        return expr
    }

    private factor(): Expr {
        let expr: Expr = this.unary()

        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            let operator: Token = this.previous()
            let right: Expr = this.unary()
            expr = new Binary(expr, operator, right)
        }

        return expr
    }

    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            let operator: Token = this.previous()
            let right: Expr = this.unary()
            return new Unary(operator, right)
        }

        return this.primary()
    }

    private primary(): Expr {
        if (this.match(TokenType.FALSE)) return new Literal(false)
        if (this.match(TokenType.TRUE)) return new Literal(true)
        if (this.match(TokenType.NIL)) return new Literal(null)

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().literal)
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            let expr: Expr = this.expression()
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
            return new Grouping(expr)
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return new variable(this.previous())
        }
        throw new LoxError(this.line(), 'Syntax', `Expression Expected, Got '${this.currentLexeme()}'`)
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
        throw new LoxError(this.tokens[this.currTokenIndex].line, 'Syntax', message)
    }

    /**
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
}

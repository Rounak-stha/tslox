import LoxError from '../error/LoxError'
import Token from '../tokenizer/Token'
import TokenType from '../tokenizer/TokenType'
import { Binary, Expr, Grouping, Literal, Unary } from '../expression'

export default class Parser {
    private readonly tokens: Token[]
    private currTokenIndex = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse(): Expr | void {
        try {
            return this.expression()
        } catch (e) {
            console.log(e)
        }
    }

    private expression(): Expr {
        return this.equality()
    }

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
        return this.currTokenIndex >= this.tokens.length
    }
}

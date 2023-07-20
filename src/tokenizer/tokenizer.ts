import TokenType from './TokenType'
import Token from './Token'
import LoxError from '../error/LoxError'

export default class Tokenizer {
    private source: string
    private tokens: Token[] = []
    private start = 0 // start index of the curreny lexeme in the source
    private cursor = 0 // index of the scanner in the source
    private line = 1

    private static keywords: Record<string, TokenType> = {
        and: TokenType.AND,
        class: TokenType.CLASS,
        else: TokenType.ELSE,
        false: TokenType.FALSE,
        for: TokenType.FOR,
        fun: TokenType.FUN,
        if: TokenType.IF,
        nil: TokenType.NIL,
        or: TokenType.OR,
        print: TokenType.PRINT,
        return: TokenType.RETURN,
        super: TokenType.SUPER,
        this: TokenType.THIS,
        true: TokenType.TRUE,
        var: TokenType.VAR,
        while: TokenType.WHILE,
    }

    constructor(source: string) {
        this.source = source
    }

    get Tokens() {
        return this.tokens
    }

    /**
     * Scans the source for lexemes
     */
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.cursor
            this.scanToken()
        }
        this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
    }

    /**
     * Scans the source from the current cursor position for valid lexeme and adds to token list if found
     * Else if unknown word is found throws an error
     */
    private scanToken() {
        let c = this.advance()
        switch (c) {
            case '(':
                this.addToken(TokenType.LEFT_PAREN)
                break
            case ')':
                this.addToken(TokenType.RIGHT_PAREN)
                break
            case '{':
                this.addToken(TokenType.LEFT_BRACE)
                break
            case '}':
                this.addToken(TokenType.RIGHT_BRACE)
                break
            case ',':
                this.addToken(TokenType.COMMA)
                break
            case '.':
                this.addToken(TokenType.DOT)
                break
            case '-':
                this.addToken(TokenType.MINUS)
                break
            case '+':
                this.addToken(TokenType.PLUS)
                break
            case ';':
                this.addToken(TokenType.SEMICOLON)
                break
            case '*':
                this.addToken(TokenType.STAR)
                break
            case '?':
                this.addToken(TokenType.QUESTION_MARK)
                break
            case ':':
                this.addToken(TokenType.COLON)
                break
            case '!':
                // ! can be a standalone token but in our grammar it can also be followed by a =
                this.addToken(this.advanceIfNextEquals('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
                break
            case '=':
                // = can be a standalone token but in our grammar it can also be followed by a =
                this.addToken(this.advanceIfNextEquals('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
                break
            case '<':
                this.addToken(this.advanceIfNextEquals('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
                break
            case '>':
                this.addToken(this.advanceIfNextEquals('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
                break
            case '/':
                // if comment
                if (this.advanceIfNextEquals('/')) {
                    while (this.peek() !== '\n' && !this.isAtEnd()) {
                        this.advance()
                    }
                } else {
                    this.addToken(TokenType.SLASH)
                }
                break
            // Ignore whitespace.
            case ' ':
            case '\r':
            case '\t':
                break
            case '\n':
                this.line++
                break
            // longer lexemes
            case '"':
                this.scanString()
                break
            default:
                if (this.isDigit(c)) {
                    this.scanNumber()
                    break
                } else if (this.isAlpha(c)) {
                    this.scanIdentifier()
                    break
                } else {
                    throw new LoxError(this.line, 'Unknown Lexeme')
                }
        }
    }

    private isAlpha(c: string) {
        c = c.toLowerCase()
        return c >= 'a' && c <= 'z'
    }

    private scanIdentifier() {
        while (this.isAlpha(this.peek()) || this.isDigit(this.peek())) {
            this.advance()
        }
        const text = this.source.substring(this.start, this.cursor)
        const tokenType: TokenType = Tokenizer.keywords[text]
        if (tokenType !== undefined) {
            this.addToken(tokenType)
        } else {
            this.addToken(TokenType.IDENTIFIER, text)
        }
    }

    private isDigit(c: string) {
        return c >= '0' && c <= '9'
    }

    /**
     * Scans a number and if the number ends witha  `.`, then the trailing dot is ignored
     * if not then the float valus is parsed with the dot
     */
    private scanNumber() {
        while (this.isDigit(this.peek())) {
            this.advance()
        }
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance()
            while (this.isDigit(this.peek())) {
                this.advance()
            }
        }

        this.addToken(TokenType.NUMBER, Number(this.source.substring(this.start, this.cursor)))
    }

    /**
     *
     */
    private scanString(): void {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++
            }
            this.advance()
        }

        if (this.isAtEnd()) {
            throw new LoxError(this.line, 'Unterminated String')
        }

        // Advance past the closing `""`
        this.advance()
        const str = this.source.substring(this.start + 1, this.cursor - 1)
        this.addToken(TokenType.STRING, str)
    }

    /**
     * As the name suggest, it peeks the chatacter at the cursor index in the source
     * code and returns the char if !EOF else returns the null string character
     */
    private peek(): string {
        if (!this.isAtEnd()) {
            return this.source.charAt(this.cursor)
        }
        return '\0'
    }

    /**
     * As the name suggest, it peeks the chatacter at the cursor index + 1 in the
     * source code and returns the char if !EOF else returns the null string character
     */
    private peekNext(): string {
        if (!(this.cursor + 1 >= this.source.length)) {
            return this.source.charAt(this.cursor + 1)
        }
        return '\0'
    }

    /**
     * Creates a new Token of the type an adds it to the token list
     */
    private addToken(type: TokenType, literal?: any) {
        const lexeme = this.source.substring(this.start, this.cursor)
        this.tokens.push(new Token(type, lexeme, literal === 0 || literal ? literal : null, this.line))
    }

    /**
     * Only advance after checking if the cursor pointer is at end
     * The function reads and returns the cursor character and increments the pointer by 1
     * @returns the char at cursor index and increments the cursor index
     */
    advance() {
        return this.source.charAt(this.cursor++)
    }

    /**
     * Check if the provided character matches the next char in the source and
     * advances the cursor index pointer if it's a match
     */
    advanceIfNextEquals(char: string) {
        if (this.isAtEnd()) return false
        if (this.source.charAt(this.cursor) === char) {
            this.cursor++
            return true
        }
        return false
    }

    /**
     * Checks if the cursor index pointer is at the end of the source code
     */
    isAtEnd() {
        return this.cursor >= this.source.length
    }
}

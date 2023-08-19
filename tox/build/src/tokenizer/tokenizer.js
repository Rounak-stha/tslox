"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenType_1 = __importDefault(require("./TokenType"));
const Token_1 = __importDefault(require("./Token"));
const LoxError_1 = __importDefault(require("../error/LoxError"));
class Tokenizer {
    constructor(source) {
        this.tokens = [];
        this.start = 0; // start index of the curreny lexeme in the source
        this.cursor = 0; // index of the scanner in the source
        this.line = 1;
        this.source = source;
    }
    get Tokens() {
        return this.tokens;
    }
    /**
     * Scans the source for lexemes
     */
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.cursor;
            this.scanToken();
        }
        this.tokens.push(new Token_1.default(TokenType_1.default.EOF, '', null, this.line));
    }
    /**
     * Scans the source from the current cursor position for valid lexeme and adds to token list if found
     * Else if unknown word is found throws an error
     */
    scanToken() {
        let c = this.advance();
        switch (c) {
            case '(':
                this.addToken(TokenType_1.default.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType_1.default.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType_1.default.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType_1.default.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType_1.default.COMMA);
                break;
            case '.':
                this.addToken(TokenType_1.default.DOT);
                break;
            case '-':
                this.addToken(TokenType_1.default.MINUS);
                break;
            case '+':
                this.addToken(TokenType_1.default.PLUS);
                break;
            case ';':
                this.addToken(TokenType_1.default.SEMICOLON);
                break;
            case '*':
                this.addToken(TokenType_1.default.STAR);
                break;
            case '!':
                // ! can be a standalone token but in our grammar it can also be followed by a =
                this.addToken(this.advanceIfNextEquals('=') ? TokenType_1.default.BANG_EQUAL : TokenType_1.default.BANG);
                break;
            case '=':
                // = can be a standalone token but in our grammar it can also be followed by a =
                this.addToken(this.advanceIfNextEquals('=') ? TokenType_1.default.EQUAL_EQUAL : TokenType_1.default.EQUAL);
                break;
            case '<':
                this.addToken(this.advanceIfNextEquals('=') ? TokenType_1.default.LESS_EQUAL : TokenType_1.default.LESS);
                break;
            case '>':
                this.addToken(this.advanceIfNextEquals('=') ? TokenType_1.default.GREATER_EQUAL : TokenType_1.default.GREATER);
                break;
            case '/':
                // if comment
                if (this.advanceIfNextEquals('/')) {
                    while (this.peek() !== '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                }
                else {
                    this.addToken(TokenType_1.default.SLASH);
                }
                break;
            // Ignore whitespace.
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            // longer lexemes
            case '"':
                this.scanString();
                break;
            default:
                if (this.isDigit(c)) {
                    this.scanNumber();
                    break;
                }
                else if (this.isAlpha(c)) {
                    this.scanIdentifier();
                    break;
                }
                else {
                    throw new LoxError_1.default(this.line, 'Unknown Lexeme');
                }
        }
    }
    isAlpha(c) {
        c = c.toLowerCase();
        return c >= 'a' && c <= 'z';
    }
    scanIdentifier() {
        while (this.isAlpha(this.peek()) || this.isDigit(this.peek())) {
            this.advance();
        }
        const text = this.source.substring(this.start, this.cursor);
        const tokenType = Tokenizer.keywords[text];
        if (tokenType !== undefined) {
            this.addToken(tokenType);
        }
        else {
            this.addToken(TokenType_1.default.IDENTIFIER, text);
        }
    }
    isDigit(c) {
        return c >= '0' && c <= '9';
    }
    /**
     * Scans a number and if the number ends witha  `.`, then the trailing dot is ignored
     * if not then the float valus is parsed with the dot
     */
    scanNumber() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        this.addToken(TokenType_1.default.NUMBER, this.source.substring(this.start, this.cursor));
    }
    /**
     *
     */
    scanString() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
            }
            this.advance();
        }
        if (this.isAtEnd()) {
            throw new LoxError_1.default(this.line, 'Unterminated String');
        }
        // Advance past the closing `""`
        this.advance();
        const str = this.source.substring(this.start + 1, this.cursor - 1);
        this.addToken(TokenType_1.default.STRING, str);
    }
    /**
     * As the name suggest, it peeks the chatacter at the cursor index in the source code and returns the char if !EOF else returns the null string character
     * @returns string
     */
    peek() {
        if (!this.isAtEnd()) {
            return this.source.charAt(this.cursor);
        }
        return '\0';
    }
    /**
     * As the name suggest, it peeks the chatacter at the cursor index + 1 in the source code and returns the char if !EOF else returns the null string character
     * @returns string
     */
    peekNext() {
        if (!(this.cursor + 1 >= this.source.length)) {
            return this.source.charAt(this.cursor + 1);
        }
        return '\0';
    }
    /**
     * Creates a new Token of the type an adds it to the token list
     * @param type TokenType
     * @param literal object | undefined
     */
    addToken(type, literal) {
        const lexeme = this.source.substring(this.start, this.cursor);
        this.tokens.push(new Token_1.default(type, lexeme, literal ? literal : null, this.line));
    }
    /**
     * Only advance after checking if the cursor pointer is at end
     * The function reads and returns the cursor character and increments the pointer by 1
     * @returns the char at cursor index and increments the cursor index
     */
    advance() {
        return this.source.charAt(this.cursor++);
    }
    /**
     * Check if the provided character matches the next char in the source and advances the cursor index pointer if it's a match
     * @param char Character to check
     * @returns Boolean: True if next character matches the provided char else false
     */
    advanceIfNextEquals(char) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.cursor) === char) {
            this.cursor++;
            return true;
        }
        return false;
    }
    /**
     * Checks if the cursor index pointer is at the end of the source code
     * @returns boolean
     */
    isAtEnd() {
        return this.cursor >= this.source.length;
    }
}
Tokenizer.keywords = {
    and: TokenType_1.default.AND,
    class: TokenType_1.default.CLASS,
    else: TokenType_1.default.ELSE,
    false: TokenType_1.default.FALSE,
    for: TokenType_1.default.FOR,
    fun: TokenType_1.default.FUN,
    if: TokenType_1.default.IF,
    nil: TokenType_1.default.NIL,
    or: TokenType_1.default.OR,
    print: TokenType_1.default.PRINT,
    return: TokenType_1.default.RETURN,
    super: TokenType_1.default.SUPER,
    this: TokenType_1.default.THIS,
    true: TokenType_1.default.TRUE,
    var: TokenType_1.default.VAR,
    while: TokenType_1.default.WHILE
};
exports.default = Tokenizer;

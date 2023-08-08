import TokenType from './TokenType'

class Token {
    type: TokenType
    lexeme: string
    literal: string | null
    line: number
    from: number
    to: number

    constructor(type: TokenType, lexeme: string, literal: string | null, line: number, from: number, to: number) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        this.line = line
        this.from = from
        this.to = to
    }

    toString() {
        return this.type + ' ' + this.lexeme + ' ' + this.literal
    }
}

export default Token

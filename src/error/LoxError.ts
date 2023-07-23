import Token from '../tokenizer/Token'

type ErrorType = 'Syntax' | 'Unknown Lexeme' | 'Unterminated String' | 'Parse Error' | 'Runtime'

class LoxError extends Error {
    code: number
    type: ErrorType

    constructor(line: number, type: ErrorType, message?: string) {
        switch (type) {
            case 'Unknown Lexeme':
                super(`[Unknown Lexeme | Line: ${line}]${message ? ' ' + message : ''}`)
                this.code = 401
                this.type = type
                break
            case 'Syntax':
                super(`[Syntax Error | Line: ${line}]${message ? ' ' + message : ''}`)
                this.code = 402
                this.type = type
                break
            case 'Unterminated String':
                super(`[Unterminated String | Line: ${line}]${message ? ' ' + message : ''}`)
                this.code = 403
                this.type = type
                break
            case 'Runtime':
                super(`[Runtime Error | Line: ${line}]${message ? ' ' + message : ''}`)
                this.code = 403
                this.type = type
                break
            default:
                super('Unknown Error')
                this.code = 400
                this.type = type
        }
    }
}

export function RuntimeError(token: Token, msg: string) {
    throw new LoxError(token.line, 'Runtime', msg)
}

export default LoxError

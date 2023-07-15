type ErrorType = 'Syntax' | 'Unknown Lexeme' | 'Unterminated String'

class LoxError extends Error {
	code: number
	type: ErrorType

	constructor(line: number, type: ErrorType) {
		switch (type) {
			case 'Unknown Lexeme':
				super(`Unknown Lexeme at line: ${line}`)
				this.code = 401
				this.type = type
				break
			case 'Syntax':
				super(`Syntax Error at line: ${line}`)
				this.code = 402
				this.type = type
				break
			case 'Unterminated String':
				super(`Unterminated String at line: ${line}`)
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

export default LoxError

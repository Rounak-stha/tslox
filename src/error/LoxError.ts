type ErrorType = 'syntax' | 'Unknown Lexeme'

class LoxError extends Error {
	code: number
	type: ErrorType

	constructor(line: number, type: ErrorType) {
		if (type == 'Unknown Lexeme') {
			super(`Unknown Lexeme at line: ${line}`)
			this.code = 401
			this.type = type
		} else if ((type = 'syntax')) {
			super(`Syntax Error at line: ${line}`)
			this.code = 402
			this.type = type
		} else {
			super('Unknown Error')
			this.code = 400
			this.type = type
		}
	}
}

export default LoxError

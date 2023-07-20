import Tokenizer from '../src/tokenizer/tokenizer'
import TokenType from '../src/tokenizer/TokenType'
import LoxError from '../src/error/LoxError'

describe('Test Scanner', () => {
    it('Test Punctuations', () => {
        const scanner = new Tokenizer(', ; .')
        scanner.scanTokens()
        const tokens = scanner.Tokens

        // Assert
        expect(tokens[0].type).toBe(TokenType.COMMA)
        expect(tokens[0].lexeme).toBe(',')
        expect(tokens[1].type).toBe(TokenType.SEMICOLON)
        expect(tokens[1].lexeme).toBe(';')
        expect(tokens[2].type).toBe(TokenType.DOT)
        expect(tokens[2].lexeme).toBe('.')

        for (let token of tokens) {
            expect(token.literal).toBe(null)
            expect(token.line).toBe(1)
        }
    })

    it('Test Braces', () => {
        const scanner = new Tokenizer('({})')
        scanner.scanTokens()
        const tokens = scanner.Tokens

        // Assert
        expect(tokens[0].type).toBe(TokenType.LEFT_PAREN)
        expect(tokens[0].lexeme).toBe('(')
        expect(tokens[1].type).toBe(TokenType.LEFT_BRACE)
        expect(tokens[1].lexeme).toBe('{')
        expect(tokens[2].type).toBe(TokenType.RIGHT_BRACE)
        expect(tokens[2].lexeme).toBe('}')
        expect(tokens[3].type).toBe(TokenType.RIGHT_PAREN)
        expect(tokens[3].lexeme).toBe(')')

        for (let token of tokens) {
            expect(token.literal).toBe(null)
            expect(token.line).toBe(1)
        }
    })

    it('Test Var', () => {
        const scanner = new Tokenizer('var a = 1')
        scanner.scanTokens()
        const tokens = scanner.Tokens

        // Assert
        expect(tokens[0].type).toBe(TokenType.VAR)
        expect(tokens[0].lexeme).toBe('var')
        expect(tokens[0].literal).toBe(null)
        expect(tokens[0].line).toBe(1)
    })

    it('Test Identifier', () => {
        const scanner = new Tokenizer('var num = 1')
        scanner.scanTokens()
        const tokens = scanner.Tokens

        // Assert
        expect(tokens[1].type).toBe(TokenType.IDENTIFIER)
        expect(tokens[1].lexeme).toBe('num')
        expect(tokens[1].literal).toBe('num')
        expect(tokens[1].line).toBe(1)
    })

    it('Test Operators', () => {
        const scanner = new Tokenizer('+ - * / = == > < >= <= ! !=')
        scanner.scanTokens()
        const tokens = scanner.Tokens

        // Assert
        expect(tokens[0].type).toBe(TokenType.PLUS)
        expect(tokens[0].lexeme).toBe('+')

        expect(tokens[1].type).toBe(TokenType.MINUS)
        expect(tokens[1].lexeme).toBe('-')

        expect(tokens[2].type).toBe(TokenType.STAR)
        expect(tokens[2].lexeme).toBe('*')

        expect(tokens[3].type).toBe(TokenType.SLASH)
        expect(tokens[3].lexeme).toBe('/')

        expect(tokens[4].type).toBe(TokenType.EQUAL)
        expect(tokens[4].lexeme).toBe('=')

        expect(tokens[5].type).toBe(TokenType.EQUAL_EQUAL)
        expect(tokens[5].lexeme).toBe('==')

        expect(tokens[6].type).toBe(TokenType.GREATER)
        expect(tokens[6].lexeme).toBe('>')

        expect(tokens[7].type).toBe(TokenType.LESS)
        expect(tokens[7].lexeme).toBe('<')

        expect(tokens[8].type).toBe(TokenType.GREATER_EQUAL)
        expect(tokens[8].lexeme).toBe('>=')

        expect(tokens[9].type).toBe(TokenType.LESS_EQUAL)
        expect(tokens[9].lexeme).toBe('<=')

        expect(tokens[10].type).toBe(TokenType.BANG)
        expect(tokens[10].lexeme).toBe('!')

        expect(tokens[11].type).toBe(TokenType.BANG_EQUAL)
        expect(tokens[11].lexeme).toBe('!=')

        for (let token of tokens) {
            expect(token.literal).toBe(null)
            expect(token.line).toBe(1)
        }
    })

    it('Test Multiline and Literals', () => {
        const str = 'This is a string'
        const scanner = new Tokenizer(`
			var str = "${str}"
			var num = 11.12
			var anotherNum = 1.`) // no ''\n' at the end (To test peekNext() at the end of the source)
        scanner.scanTokens()
        const tokens = scanner.Tokens

        // Assert
        expect(tokens[3].type).toBe(TokenType.STRING)
        expect(tokens[3].lexeme).toBe(`"${str}"`)
        expect(tokens[3].literal).toBe(str)
        expect(tokens[3].line).toBe(2)

        expect(tokens[7].type).toBe(TokenType.NUMBER)
        expect(tokens[7].lexeme).toBe('11.12')
        expect(tokens[7].literal).toBe(11.12)
        expect(tokens[7].line).toBe(3)

        expect(tokens[3].toString()).toBe(`STRING "This is a string" This is a string`)
        expect(tokens[7].toString()).toBe(`NUMBER 11.12 11.12`)
    })

    it('Test Multiline Untermiated String', () => {
        const str = `
			"this is a 
				multiline Unterminated
				string
		`
        const scanner = new Tokenizer(str)

        try {
            scanner.scanTokens()
        } catch (e) {
            if (e instanceof LoxError) {
                expect(e.message).toBe('Unterminated String at line: 5')
            }
        }
    })

    it('Test Comment', () => {
        const scanner = new Tokenizer(`
			// This is a comment
		`)
        scanner.scanTokens()
        const tokens = scanner.Tokens

        expect(tokens.length).toBe(1)

        expect(tokens[0].type).toBe(TokenType.EOF)
        expect(tokens[0].lexeme).toBe('')
        expect(tokens[0].literal).toBe(null)
        expect(tokens[0].line).toBe(3)
    })

    it('Test Unknown Lexeme Error', () => {
        const str = 'This is a string'
        const scanner = new Tokenizer(`
			var num = 1
			var str = "${str}"
			7gaus%$6
		`)
        try {
            scanner.scanTokens()
            const tokens = scanner.Tokens
        } catch (e) {
            if (e instanceof LoxError) {
                if (e.type == 'Unknown Lexeme') {
                    expect(e.message).toBe('Unknown Lexeme at line: 4')
                }
            } else {
                throw e
            }
        }
    })
})

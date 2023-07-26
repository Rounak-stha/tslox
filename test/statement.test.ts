import { Binary, Literal } from '../src/expression'
import { PrintStmt, VarStmt, ExpressionStmt } from '../src/statement'
import Token from '../src/tokenizer/Token'
import TokenType from '../src/tokenizer/TokenType'

describe('Test Statement', () => {
    it('Test Var Statement', () => {
        const name = new Token(TokenType.IDENTIFIER, 'name', null, 1)
        const initializer_1 = null
        const initializer_2 = new Literal(1)

        const varStmt_1 = new VarStmt(name, initializer_1)
        const varStmt_2 = new VarStmt(name, initializer_2)

        expect(varStmt_1).toEqual({
            name: { type: 'IDENTIFIER', lexeme: 'name', literal: null, line: 1 },
            initializer: null,
        })

        expect(varStmt_2).toEqual({
            name: { type: 'IDENTIFIER', lexeme: 'name', literal: null, line: 1 },
            initializer: { value: 1 },
        })
    })

    it('Test Print Statement', () => {
        const printStmt = new PrintStmt(
            new Binary(new Literal(1), new Token(TokenType.PLUS, '+', null, 1), new Literal(2))
        )

        expect(printStmt).toEqual({
            expression: {
                left: { value: 1 },
                operator: { type: 'PLUS', lexeme: '+', literal: null, line: 1 },
                right: { value: 2 },
            },
        })
    })

    it('Test Expression Statement', () => {
        const exprStmt = new ExpressionStmt(
            new Binary(new Literal(1), new Token(TokenType.STAR, '*', null, 1), new Literal(2))
        )

        expect(exprStmt).toEqual({
            expression: {
                left: { value: 1 },
                operator: { type: 'STAR', lexeme: '*', literal: null, line: 1 },
                right: { value: 2 },
            },
        })
    })
})

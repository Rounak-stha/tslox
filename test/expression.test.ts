import { Binary, Unary, Grouping, Literal, Expr, Assignment, Ternary, CallExpr } from '../src/expression'
import Token from '../src/tokenizer/Token'
import TokenType from '../src/tokenizer/TokenType'

describe('All Expression Class Test', () => {
    it('Test Binary Expression', () => {
        const multiplicationExpression = new Binary(
            new Literal(2),
            new Token(TokenType.PLUS, '*', '', 1),
            new Literal(2)
        )
        const aditionExpresion = new Binary(
            new Literal(1),
            new Token(TokenType.PLUS, '+', '', 1),
            multiplicationExpression
        )
        const subtractionExpression = new Binary(
            aditionExpresion,
            new Token(TokenType.MINUS, '-', '', 1),
            new Literal(9)
        )

        expect(multiplicationExpression.left).toEqual(new Literal(2))
        expect(multiplicationExpression.right).toEqual(new Literal(2))
        expect(multiplicationExpression.operator.lexeme).toBe('*')

        expect(aditionExpresion.left).toEqual(new Literal(1))
        expect(aditionExpresion.right).toBe(multiplicationExpression)

        expect(subtractionExpression.left).toBe(aditionExpresion)
    })

    it('Test Unary Expression', () => {
        const numberLiteral1 = new Literal(1)
        const booleanLiteralFalse = new Literal(false)
        const negativeUnary = new Unary(new Token(TokenType.MINUS, '-', '', 1), numberLiteral1)
        const negationUnary = new Unary(new Token(TokenType.BANG, '!', '', 1), booleanLiteralFalse)

        expect(negativeUnary.operator).toEqual(new Token(TokenType.MINUS, '-', '', 1))
        expect(negativeUnary.right).toBe(numberLiteral1)

        expect(negationUnary.operator).toEqual(new Token(TokenType.BANG, '!', '', 1))
        expect(negationUnary.right).toBe(booleanLiteralFalse)
    })

    it('Test Assignment Expression', () => {
        const assinmentExpr = new Assignment(new Token(TokenType.IDENTIFIER, 'name', null, 1), new Literal(1))

        expect(assinmentExpr).toEqual({
            name: { type: 'IDENTIFIER', lexeme: 'name', literal: null, line: 1 },
            value: { value: 1 },
        })
    })

    it('Test Ternary Expression', () => {
        const ternaryExpr = new Ternary(new Literal(true), new Literal(1), new Literal(2))

        expect(ternaryExpr).toEqual({
            evaluater: { value: true },
            first: { value: 1 },
            second: { value: 2 },
        })
    })

    it('Test Call Expression', () => {
        const callExpr = new CallExpr(
            new Literal('Func Name'),
            [new Literal(1)],
            new Token(TokenType.RIGHT_PAREN, ')', null, 1)
        )

        expect(Object.keys(callExpr)).toEqual(['callee', 'args', 'endParen'])
        expect(callExpr['callee']).toBeInstanceOf(Literal)
        expect(callExpr['args']).toBeInstanceOf(Array)
        expect(callExpr['args'][0]).toBeInstanceOf(Literal)
        expect(callExpr['endParen']).toBeInstanceOf(Token)
    })
})

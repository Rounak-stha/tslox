import { Binary, Unary, Grouping, Literal, Expr, Assignment, Ternary, CallExpr } from '../src/expression'
import Token from '../src/tokenizer/Token'
import TokenType from '../src/tokenizer/TokenType'

describe('All Expression Class Test', () => {
    const from = 1,
        to = 2

    it('Test Literal Expression', () => {
        const literalOne = new Literal(1, from, to)

        expect(literalOne.type).toBe('LiteralExpression')
        // expect(literalOne.value).toBeInstanceOf(LiteralValue) // how to assert custom types? 
        expect(literalOne.from).toBe(from)
        expect(literalOne.to).toBe(to)
    })

    it('Test Binary Expression', () => {
        const multiplicationExpression = new Binary(
            new Literal(2, from, to),
            new Token(TokenType.PLUS, '*', '', 1, from, to),
            new Literal(2, from, to),
            from,
            to
        )

        expect(Object.keys(multiplicationExpression)).toEqual(['from', 'to', 'type', 'left', 'operator', 'right'])
        expect(multiplicationExpression.left).toBeInstanceOf(Literal)
        expect(multiplicationExpression.right).toBeInstanceOf(Literal)
        expect(multiplicationExpression.operator).toBeInstanceOf(Token)
        expect(multiplicationExpression.operator.lexeme).toBe('*')
        expect(multiplicationExpression.from).toBe(from)
        expect(multiplicationExpression.to).toBe(to)
    })

    it('Test Unary Expression', () => {
        const numberLiteral1 = new Literal(1, from, to)
        const booleanLiteralFalse = new Literal(false, from, to)
        const negativeUnary = new Unary(new Token(TokenType.MINUS, '-', '', 1, from, to), numberLiteral1, from, to)
        const negationUnary = new Unary(new Token(TokenType.BANG, '!', '', 1, from, to), booleanLiteralFalse, from, to)

        expect(Object.keys(negativeUnary)).toEqual(['from', 'to', 'type', 'operator', 'right'])
        expect(negativeUnary.operator).toEqual(new Token(TokenType.MINUS, '-', '', 1, from, to))
        expect(negativeUnary.right).toBe(numberLiteral1)

        expect(negationUnary.operator).toEqual(new Token(TokenType.BANG, '!', '', 1, from, to))
        expect(negationUnary.right).toBe(booleanLiteralFalse)
        expect(negationUnary.from).toBe(from)
        expect(negationUnary.to).toBe(to)
    })

    it('Test Assignment Expression', () => {
        const assinmentExpr = new Assignment(
            new Token(TokenType.IDENTIFIER, 'name', null, 1, from, to),
            new Literal(1, from, to),
            from,
            to
        )

        expect(Object.keys(assinmentExpr)).toEqual(['from', 'to', 'type', 'name', 'value'])
        expect(assinmentExpr.name).toBeInstanceOf(Token)
        expect(assinmentExpr.value).toBeInstanceOf(Literal)
        expect(assinmentExpr.from).toBe(from)
        expect(assinmentExpr.to).toBe(to)
    })

    it('Test Ternary Expression', () => {
        const ternaryExpr = new Ternary(
            new Literal(true, from, to),
            new Literal(1, from, to),
            new Literal(2, from, to),
            from,
            to
        )

        expect(Object.keys(ternaryExpr)).toEqual(['from', 'to', 'type', 'evaluater', 'first', 'second'])
        expect(ternaryExpr.type).toBe('TernaryExpression')
        expect(ternaryExpr.evaluater).toBeInstanceOf(Literal)
        expect(ternaryExpr.first).toBeInstanceOf(Literal)
        expect(ternaryExpr.second).toBeInstanceOf(Literal)
        expect(ternaryExpr.from).toBe(from)
        expect(ternaryExpr.to).toBe(to)
    })

    it('Test Call Expression', () => {
        const callExpr = new CallExpr(
            new Literal('Func Name', 1, 2),
            [new Literal(1, from, to)],
            new Token(TokenType.RIGHT_PAREN, ')', null, 1, from, to),
            from,
            to
        )

        expect(Object.keys(callExpr)).toEqual(['from', 'to', 'type', 'callee', 'args', 'endParen'])
        expect(callExpr.type).toBe('CallExpression')
        expect(callExpr['callee']).toBeInstanceOf(Literal)
        expect(callExpr['args']).toBeInstanceOf(Array)
        expect(callExpr['args'][0]).toBeInstanceOf(Literal)
        expect(callExpr['endParen']).toBeInstanceOf(Token)
        expect(callExpr.from).toBe(from)
        expect(callExpr.to).toBe(to)
    })
})

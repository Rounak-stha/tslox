import { Binary, Unary, Grouping, Literal, Expr } from '../src/expression'
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

		expect(multiplicationExpression.left).toBe(2)
		expect(multiplicationExpression.right).toBe(2)
		expect(multiplicationExpression.operator.lexeme).toBe('*')

		expect(aditionExpresion.left).toBe(1)
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
})

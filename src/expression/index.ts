import Token from '../tokenizer/Token'

export interface Expr {}

export type LiteralValue = string | number | boolean | null

export class Binary implements Expr {
	left: Expr
	operator: Token
	right: Expr
	constructor(left: Expr, operator: Token, right: Expr) {
		this.left = left
		this.operator = operator
		this.right = right
	}
}

export class Unary implements Expr {
	operator: Token
	right: Expr
	constructor(operator: Token, right: Expr) {
		this.operator = operator
		this.right = right
	}
}

export class Grouping implements Expr {
	expression: Expr
	constructor(expression: Expr) {
		this.expression = expression
	}
}

export class Literal implements Expr {
	value: LiteralValue
	constructor(value: LiteralValue) {
		this.value = value
	}
}

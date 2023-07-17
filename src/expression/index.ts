import Token from '../tokenizer/Token'

export abstract class Expr {
	abstract accept<T>(visitor: Visitor<T>): T
}

export interface Visitor<T> {
	visitBinaryExpr(expr: Binary): T
	visitUnaryExpr(expr: Unary): T
	visitGroupingExpr(expr: Grouping): T
	visitLiteralExpr(expr: Literal): T
}

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

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitBinaryExpr(this)
	}
}

export class Unary implements Expr {
	operator: Token
	right: Expr

	constructor(operator: Token, right: Expr) {
		this.operator = operator
		this.right = right
	}

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitUnaryExpr(this)
	}
}

export class Grouping implements Expr {
	expression: Expr

	constructor(expression: Expr) {
		this.expression = expression
	}

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitGroupingExpr(this)
	}
}

export class Literal implements Expr {
	value: LiteralValue

	constructor(value: LiteralValue) {
		this.value = value
	}

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitLiteralExpr(this)
	}
}

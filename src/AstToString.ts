import { Binary, Expr, Grouping, Literal, Unary, Visitor } from './expression'

export default class AstToString implements Visitor<string> {
	print(expr: Expr): string {
		return expr.accept(this)
	}

	visitBinaryExpr(expr: Binary): string {
		return this.parenthesize(expr.operator.lexeme, expr.left, expr.right)
	}

	visitUnaryExpr(expr: Unary): string {
		return this.parenthesize(expr.operator.lexeme, expr.right)
	}

	visitGroupingExpr(expr: Grouping): string {
		return this.parenthesize('Group', expr.expression)
	}

	visitLiteralExpr(expr: Literal): string {
		return String(expr.value)
	}

	private parenthesize(name: string, ...exprs: Expr[]): string {
		let str = `(${name}`

		for (let expr of exprs) {
			str += ' '
			str += expr.accept(this)
		}
		str += ')'

		return str
	}
}

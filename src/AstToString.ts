import { Assignment, Binary, CallExpr, Expr, Grouping, Literal, Logical, Ternary, Unary, ExprVisitor as Visitor, variable } from './expression'

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

    visitAssignmentExpression(expr: Assignment): string {
        return '( ' + expr.type + ' ' + expr.name.lexeme + ' ', expr.value.accept(this) + ')'
    }

    visitCallExpression(expr: CallExpr): string {
        return '( ' + expr.type + ' ' + this.parenthesize(expr.callee.type, expr.callee) + this.parenthesize('Arguments', ...expr.args) + ')'
    }

    visitVariableExpression(expr: variable): string {
        return this.parenthesize(expr.type, expr)
    }

    visitTernaryExpression(expr: Ternary): string {
        return this.parenthesize(expr.type, expr.first, expr.second)
    }

    visitLogicalExpr(expr: Logical): string {
        return this.parenthesize(expr.type + ' ' + expr.operator.lexeme, expr.left, expr.right)
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

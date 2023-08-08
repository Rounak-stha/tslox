import Token from '../tokenizer/Token'
import { Node } from '../types'

export abstract class Expr implements Node {
    abstract type: string
    from: number
    to: number
    abstract accept<T>(visitor: ExprVisitor<T>): T

    constructor(from: number, to: number) {
        this.from = from
        this.to = to
    }
}

export interface ExprVisitor<T> {
    visitBinaryExpr(expr: Binary): T
    visitUnaryExpr(expr: Unary): T
    visitGroupingExpr(expr: Grouping): T
    visitLiteralExpr(expr: Literal): T
    visitLogicalExpr(expr: Logical): T
    visitTernaryExpression(expr: Ternary): T
    visitVariableExpression(expr: variable): T
    visitAssignmentExpression(expr: Assignment): T
    visitCallExpression(expr: CallExpr): T
}

export type LiteralValue = string | number | boolean | null

export class Binary extends Expr {
    type: string = 'BinaryExpression'
    left: Expr
    operator: Token
    right: Expr

    constructor(left: Expr, operator: Token, right: Expr, from: number, to: number) {
        super(from, to)
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitBinaryExpr(this)
    }
}

export class Ternary extends Expr {
    type = 'TernaryExpression'
    evaluater: Expr
    first: Expr
    second: Expr

    constructor(evaluater: Expr, first: Expr, second: Expr, from: number, to: number) {
        super(from, to)
        this.evaluater = evaluater
        this.first = first
        this.second = second
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitTernaryExpression(this)
    }
}

export class Unary extends Expr {
    type = 'UnaryExpression'
    operator: Token
    right: Expr

    constructor(operator: Token, right: Expr, from: number, to: number) {
        super(from, to)
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitUnaryExpr(this)
    }
}

export class Grouping extends Expr {
    type = 'GroupingExpression'
    expression: Expr

    constructor(expression: Expr, from: number, to: number) {
        super(from, to)
        this.expression = expression
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitGroupingExpr(this)
    }
}

export class Literal extends Expr {
    type = 'LiteralExpression'
    value: LiteralValue

    constructor(value: LiteralValue, from: number, to: number) {
        super(from, to)
        this.value = value
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitLiteralExpr(this)
    }
}

export class Logical extends Expr {
    type = 'LogicalExpression'
    left: Expr
    operator: Token
    right: Expr

    constructor(left: Expr, operator: Token, right: Expr, from: number, to: number) {
        super(from, to)
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitLogicalExpr(this)
    }
}

export class CallExpr extends Expr {
    type = 'CallExpression'
    callee: Expr
    args: Expr[]
    endParen: Token

    constructor(callee: Expr, args: Expr[], endParen: Token, from: number, to: number) {
        super(from, to)
        this.callee = callee
        this.args = args
        this.endParen = endParen
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitCallExpression(this)
    }
}

export class variable extends Expr {
    type = 'VariableExpression'
    name: Token

    constructor(name: Token, from: number, to: number) {
        super(from, to)
        this.name = name
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitVariableExpression(this)
    }
}

export class Assignment extends Expr {
    type = 'AssignmentExpression'
    name: Token
    value: Expr

    constructor(name: Token, value: Expr, from: number, to: number) {
        super(from, to)
        this.name = name
        this.value = value
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitAssignmentExpression(this)
    }
}

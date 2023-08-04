import Token from '../tokenizer/Token'

export abstract class Expr {
    abstract accept<T>(visitor: ExprVisitor<T>): T
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

export class Binary implements Expr {
    left: Expr
    operator: Token
    right: Expr

    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitBinaryExpr(this)
    }
}

export class Ternary implements Expr {
    evaluater: Expr
    first: Expr
    second: Expr

    constructor(evaluater: Expr, first: Expr, second: Expr) {
        this.evaluater = evaluater
        this.first = first
        this.second = second
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitTernaryExpression(this)
    }
}

export class Unary implements Expr {
    operator: Token
    right: Expr

    constructor(operator: Token, right: Expr) {
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitUnaryExpr(this)
    }
}

export class Grouping implements Expr {
    expression: Expr

    constructor(expression: Expr) {
        this.expression = expression
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitGroupingExpr(this)
    }
}

export class Literal implements Expr {
    value: LiteralValue

    constructor(value: LiteralValue) {
        this.value = value
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitLiteralExpr(this)
    }
}

export class Logical implements Expr {
    left: Expr
    operator: Token
    right: Expr
    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitLogicalExpr(this)
    }
}

export class CallExpr implements Expr {
    callee: Expr
    args: Expr[]
    endParen: Token

    constructor(callee: Expr, args: Expr[], endParen: Token) {
        this.callee = callee
        this.args = args
        this.endParen = endParen
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitCallExpression(this)
    }

}

export class variable implements Expr {
    name: Token
    constructor(name: Token) {
        this.name = name
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitVariableExpression(this)
    }
}

export class Assignment implements Expr {
    name: Token
    value: Expr
    constructor(name: Token, value: Expr) {
        this.name = name
        this.value = value
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitAssignmentExpression(this)
    }
}

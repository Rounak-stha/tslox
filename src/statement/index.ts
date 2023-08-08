import { Expr } from '../expression'
import Token from '../tokenizer/Token'
import { Node } from '../types'

export interface StmtVisitor<T> {
    visitWhileStmt(stmt: WhileStmt): T
    visitExpressionStmt(stmt: ExpressionStmt): T
    visitIfStmt(stmt: IfStmt): T
    visitPrintStmt(stmt: PrintStmt): T
    visitVarStmt(stmt: VarStmt): T
    VisitBlockStmt(stmt: BlockStmt): T
    visitFunctionStmt(stmt: FunctionStmt): T
    visitReturnStmt(stmt: ReturnStmt): T
}

export abstract class Stmt implements Node {
    abstract type: string
    from: number
    to: number
    abstract accept<T>(visitor: StmtVisitor<T>): T

    constructor(from: number, to: number) {
        this.from = from
        this.to = to
    }
}

export class WhileStmt extends Stmt {
    type = 'WhileLoop'
    condition: Expr
    body: Stmt

    constructor(condition: Expr, body: Stmt, from: number, to: number) {
        super(from, to)
        this.condition = condition
        this.body = body
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitWhileStmt(this)
    }
}

export class FunctionStmt extends Stmt {
    type = 'FunctionDeclaration'
    name: Token
    parameters: Token[]
    body: Stmt[]

    constructor(name: Token, parameters: Token[], body: Stmt[], from: number, to: number) {
        super(from, to)
        this.name = name
        this.parameters = parameters
        this.body = body
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitFunctionStmt(this)
    }
}

/**
 * Token - Return Keyword Token for location data
 */
export class ReturnStmt extends Stmt {
    type = 'ReturnStatement'
    token: Token
    value: Expr | null

    constructor(token: Token, value: Expr | null, from: number, to: number) {
        super(from, to)
        this.token = token
        this.value = value
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitReturnStmt(this)
    }
}

export class ExpressionStmt extends Stmt {
    type = 'ExpressionStatement'
    expression: Expr

    constructor(expression: Expr, from: number, to: number) {
        super(from, to)
        this.expression = expression
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitExpressionStmt(this)
    }
}

export class IfStmt extends Stmt {
    type = 'IfStatement'
    condition: Expr
    thenBranch: Stmt
    elseBranch: Stmt | null

    constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null, from: number, to: number) {
        super(from, to)
        this.condition = condition
        this.thenBranch = thenBranch
        this.elseBranch = elseBranch
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitIfStmt(this)
    }
}

export class PrintStmt extends Stmt {
    type = 'PrintStatement'
    expression: Expr

    constructor(expression: Expr, from: number, to: number) {
        super(from, to)
        this.expression = expression
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitPrintStmt(this)
    }
}

export class VarStmt extends Stmt {
    type = 'VarStatement'
    name: Token
    initializer: Expr | null

    constructor(name: Token, initializer: Expr | null, from: number, to: number) {
        super(from, to)
        this.name = name
        this.initializer = initializer
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitVarStmt(this)
    }
}

export class BlockStmt extends Stmt {
    type = 'BlockStatement'
    body: Stmt[]

    constructor(statements: Stmt[], from: number, to: number) {
        super(from, to)
        this.body = statements
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.VisitBlockStmt(this)
    }
}

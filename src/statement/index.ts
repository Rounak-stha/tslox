import { Expr } from '../expression'
import Token from '../tokenizer/Token'

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

export abstract class Stmt {
    abstract accept<T>(visitor: StmtVisitor<T>): T
}

export class WhileStmt implements Stmt {
    condition: Expr
    body: Stmt

    constructor(condition: Expr, body: Stmt) {
        this.condition = condition
        this.body = body
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitWhileStmt(this)
    }
}

export class FunctionStmt implements Stmt {
    name: Token
    parameters: Token[]
    body: Stmt[]

    constructor(name: Token, parameters: Token[], body: Stmt[]) {
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
export class ReturnStmt implements Stmt {
    token: Token
    value: Expr | null
    constructor(token: Token, value: Expr | null) {
        this.token = token
        this.value = value
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitReturnStmt(this)
    }
}

export class ExpressionStmt implements Stmt {
    expression: Expr
    constructor(expression: Expr) {
        this.expression = expression
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitExpressionStmt(this)
    }
}

export class IfStmt implements Stmt {
    condition: Expr
    thenBranch: Stmt
    elseBranch: Stmt | null
    constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        this.condition = condition
        this.thenBranch = thenBranch
        this.elseBranch = elseBranch
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitIfStmt(this)
    }
}

export class PrintStmt implements Stmt {
    expression: Expr

    constructor(expression: Expr) {
        this.expression = expression
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitPrintStmt(this)
    }
}

export class VarStmt implements Stmt {
    name: Token
    initializer: Expr | null
    constructor(name: Token, initializer: Expr | null) {
        this.name = name
        this.initializer = initializer
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.visitVarStmt(this)
    }
}

export class BlockStmt implements Stmt {
    statements: Stmt[]
    constructor(statements: Stmt[]) {
        this.statements = statements
    }

    accept<T>(visitor: StmtVisitor<T>): T {
        return visitor.VisitBlockStmt(this)
    }
}

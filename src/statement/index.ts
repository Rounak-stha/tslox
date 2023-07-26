import { Expr } from '../expression'
import Token from '../tokenizer/Token'

export interface StmtVisitor<T> {
    visitExpressionStmt(stmt: ExpressionStmt): T
    visitPrintStmt(stmt: PrintStmt): T
    visitVarStmt(stmt: VarStmt): T
    VisitBlockStmt(stmt: BlockStmt): T
}

export abstract class Stmt {
    abstract accept<T>(visitor: StmtVisitor<T>): T
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

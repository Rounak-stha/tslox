import { Environment } from '../environment'
import LoxError, { RuntimeError } from '../error/LoxError'
import { ExprVisitor, Expr, Binary, Literal, Unary, Grouping, Ternary, variable, Assignment } from '../expression'
import { ExpressionStmt, PrintStmt, Stmt, StmtVisitor, VarStmt } from '../statement'
import Token from '../tokenizer/Token'
import TokenType from '../tokenizer/TokenType'

// Visitor which visits the expression and inerprets it and
// returns any value, so the T in Visitor<T> is unknown
export class Interpreter implements ExprVisitor<unknown>, StmtVisitor<void> {
    environment = new Environment()
    interpret(statements: Stmt[]): void {
        try {
            for (let statement of statements) {
                this.execute(statement)
            }
        } catch (e) {
            if (e instanceof LoxError) {
                console.log(e.message)
            } else throw e
        }
    }

    visitPrintStmt(stmt: PrintStmt): void {
        const value = this.evaluate(stmt.expression)
        console.log(value)
    }

    visitExpressionStmt(stmt: ExpressionStmt): void {
        this.evaluate(stmt.expression)
    }

    visitVarStmt(stmt: VarStmt): void {
        let value = null
        if (stmt.initializer) {
            value = this.evaluate(stmt.initializer)
        }
        this.environment.define(stmt.name.lexeme, value)
    }

    visitAssignmentExpression(expr: Assignment): unknown {
        const value = this.evaluate(expr.value)
        this.environment.assign(expr.name, value)
        return value
    }

    visitLiteralExpr(expr: Literal): unknown {
        return expr.value
    }

    visitUnaryExpr(expr: Unary): unknown {
        // first evaluate the right expression
        const value: unknown = this.evaluate(expr.right)
        switch (expr.operator.type) {
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, value)
                return -(value as number)
            case TokenType.BANG:
                return !this.isTruthy(value)
        }
    }

    /**
     * Check if the value is of boolean type
     * In ts-lox, everything except nil and false is truthy
     */
    isTruthy(value: unknown): boolean {
        if (value === null) return false
        if (typeof value === 'boolean') return value
        return true
    }

    /**
     * NEEDS ATTENTION
     */
    isEqual(left: unknown, right: unknown): boolean {
        return left === right
    }

    // Since we can have 2 operators on the basis of operands
    // Unary and Binary; so we create helpers to check
    // if the operands are numbers

    // TBH: I would create only one function as the functionality is same
    // But right now, I am sticking to the Book's style

    /**
     * Checks if the operand is a number
     * if not -> throws a runtime error
     */
    checkNumberOperand(operator: Token, operand: unknown) {
        if (typeof operand === 'number') return true
        RuntimeError(operator, 'Operand must be a number')
    }

    /**
     * Checks if the operand is a number
     * if not -> throws a runtime error
     */
    checkNumberOperands(operator: Token, left: unknown, right: unknown) {
        if (typeof left === 'number' && typeof right === 'number') return true
        RuntimeError(operator, 'Operands must be a number')
    }

    visitGroupingExpr(expr: Grouping): unknown {
        return this.evaluate(expr.expression)
    }

    private evaluate(expr: Expr) {
        return expr.accept(this)
    }

    private execute(stmt: Stmt) {
        stmt.accept(this)
    }

    visitVariableExpression(expr: variable) {
        const name = expr.name.lexeme
        return this.environment.get(name)
    }

    visitTernaryExpression(expr: Ternary): unknown {
        const evaluater = this.evaluate(expr.evaluater)
        const first = this.evaluate(expr.first)
        const second = this.evaluate(expr.second)
        // using ternary to interpret tenary HA - HA - HA
        return this.isTruthy(evaluater) ? first : second
    }

    // Right now the left and right value is either number or string
    // I do not yet know what other values can the 2 leaf nodes can take.
    // The current impementation of specifying the values as known and then
    // letting TS know the type using "as" is quite hectic since the type
    // checked before returning any value so the type is as expected before
    // we reach the return statement
    visitBinaryExpr(expr: Binary): unknown {
        const left = this.evaluate(expr.left)
        const right = this.evaluate(expr.right)

        switch (expr.operator.type) {
            case TokenType.GREATER:
                this.checkNumberOperands(expr.operator, left, right)
                return (left as number) > (right as number)
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right)
                return (left as number) >= (right as number)
            case TokenType.LESS:
                this.checkNumberOperands(expr.operator, left, right)
                return (left as number) < (right as number)
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right)
                return (left as number) <= (right as number)
            case TokenType.MINUS:
                this.checkNumberOperands(expr.operator, left, right)
                return (left as number) - (right as number)
            case TokenType.PLUS:
                if (typeof left === 'number' && typeof right === 'number') return (left as number) + (right as number)
                if (typeof left === 'string' && typeof right === 'string') return (left as string) + (right as string)
                RuntimeError(expr.operator, 'Operators must be a number or string')
            case TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right)
                return (left as number) * (right as number)
            case TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right)
                return (left as number) / (right as number)
            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right)
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right)
        }
        return null
    }
}

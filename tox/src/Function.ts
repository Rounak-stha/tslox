import { Environment } from './environment'
import { Return } from './error/Return'
import { Interpreter } from './interpreter'
import { FunctionStmt } from './statement'
import { Callable } from './types'

export class Function implements Callable {
    private declaration: FunctionStmt
    private closure: Environment
    arity: number
    constructor(funcDeclaration: FunctionStmt, closure: Environment) {
        this.declaration = funcDeclaration
        this.closure = closure
        this.arity = funcDeclaration.parameters.length
    }
    call(interpreter: Interpreter, args: unknown[]): unknown {
        const env = new Environment(this.closure) // new environment for the block
        for (let i = 0; i < this.declaration.parameters.length; i++) {
            env.define(this.declaration.parameters[i].lexeme, args[i])
        }
        try {
            interpreter.executeBlock(this.declaration.body, env)
        } catch (e) {
            if (e instanceof Return) {
                return e.value
            }
            throw e
        }
        return null
    }

    toString = () => `Func ${this.declaration.name.lexeme}()`
}

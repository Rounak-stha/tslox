import { RuntimeError } from '../error/LoxError'
import Token from '../tokenizer/Token'

export class Environment {
    private values = new Map<string, unknown>()
    private parentEnv: Environment | null = null

    constructor(outerEnv?: Environment) {
        if (outerEnv) {
            this.parentEnv = outerEnv
        }
    }

    define(name: string, value: unknown): void {
        this.values.set(name, value)
    }

    /**
     * Gets the value of the variable in the curent scope
     * Else recursively finds the variable in the parent's scope
     * @returns { unknown | null }
     */
    get(name: string): unknown {
        if (this.values.has(name)) return this.values.get(name)
        if (this.parentEnv !== null) return this.parentEnv.get(name)
        return null
    }

    /**
     * Assigns the value to the variable in the curent scope
     * Else recursively assigns the value to the variable in parent scope
     * @returns { void }
     */
    assign(name: Token, value: unknown): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value)
            return
        }
        if (this.parentEnv !== null) return this.parentEnv.assign(name, value)
        RuntimeError(name, 'Undefined Varible ' + name.lexeme + '.')
    }
}

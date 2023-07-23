import { RuntimeError } from '../error/LoxError'
import Token from '../tokenizer/Token'

export class Environment {
    private values = new Map<string, unknown>()
    define(name: string, value: unknown): void {
        this.values.set(name, value)
    }

    get(name: string): unknown {
        if (this.values.has(name)) return this.values.get(name)
        return null
    }

    assign(name: Token, value: unknown): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value)
            return
        }
        RuntimeError(name, 'Undefined Varible ' + name.lexeme + '.')
    }
}

import type { Interpreter } from '../interpreter'

export interface Callable {
    arity: number
    call(interpreter: Interpreter, args: unknown[]): unknown
    toString: () => string 
}

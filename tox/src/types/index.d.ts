import type { Interpreter } from '../interpreter'

export interface Callable {
    arity: number
    call(interpreter: Interpreter, args: unknown[]): unknown
    toString: () => string
}

export interface Location {
    from: number
    to: number
}

export interface Node extends Location {
    type: string
}

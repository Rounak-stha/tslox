import type { Interpreter } from '../interpreter'

export interface Callable {
    call(interpreter: Interpreter, args: unknown[]): unknown
}

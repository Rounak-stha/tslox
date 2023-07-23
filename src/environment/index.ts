export class Environment {
    private values = new Map<string, unknown>()
    define(name: string, value: unknown): void {
        this.values.set(name, value)
    }

    get(name: string): unknown {
        if (this.values.has(name)) return this.values.get(name)
        return null
    }
}

const subscribers: Record<string, (<T>(data: T) => void)[]> = {}

type Event_Type = 'HIGHLIGHT'

export function subscribe(event: Event_Type, cb: <T>(data: T) => void) {
    if (!subscribers[event]) {
        subscribers[event] = [cb]
    } else subscribers[event].push(cb)

    return () => subscribers[event].splice(subscribers[event].indexOf(cb), 1)
}

export function publish(event: Event_Type, data: unknown) {
    if (subscribers[event]) {
        subscribers[event].forEach(cb => cb(data))
    }
} 
interface EventAndData {
    HIGHLIGHT: { from: number; to: number }
    UNHIGHLIGHT: void
}

type EventType = keyof EventAndData
type EventData<T extends EventType> = EventAndData[T]
type Callback<T extends EventType> = (data: EventData<T>) => void

const subscribers: Record<EventType, Callback<any>[]> = {
    HIGHLIGHT: [],
    UNHIGHLIGHT: []
}

export function subscribe<T extends EventType>(event: T, cb: Callback<T>) {
    subscribers[event].push(cb)
    return () => subscribers[event].splice(subscribers[event].indexOf(cb), 1)
}

export function publish<T extends EventType>(event: T, data: EventAndData[T]) {
    if (subscribers[event]) {
        subscribers[event].forEach((cb) => cb(data))
    }
}

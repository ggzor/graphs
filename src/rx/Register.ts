export interface Register<T, R> {
    register(value: T): R
    unregister(value: T): void
}
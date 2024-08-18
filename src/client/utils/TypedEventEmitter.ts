export default class TypedEventEmitter<T extends Record<string, unknown[]>> {
  private readonly _listeners = {} as { [E in keyof T]: TypedEventEmitterListener<T[E]>[] };

  public on<E extends keyof T>(eventType: E, listener: TypedEventEmitterListener<T[E]>) {
    this._listeners[eventType] ??= [];
    this._listeners[eventType].push(listener);
  }

  public remove<E extends keyof T>(eventType: E, listener: TypedEventEmitterListener<T[E]>) {
    if (eventType in this._listeners)
      this._listeners[eventType] = this._listeners[eventType].filter((fn) => fn !== listener);
  }

  public emit<E extends keyof T>(eventType: E, ...args: T[E]) {
    this._listeners[eventType]?.forEach((listener) => listener(...args));
  }
}

export type TypedEventEmitterListener<A extends unknown[]> = (...args: A) => void | Promise<void>;
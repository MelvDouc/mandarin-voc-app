import type { ResultTuple } from "$/global-types.js";

export default function asyncWrapper<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>, formatError: (error: unknown) => string[]) {
  return async (...args: Args): Promise<ResultTuple<T>> => {
    try {
      const data = await fn(...args);
      return [data, null];
    } catch (error) {
      return [null, formatError(error)];
    }
  };
}
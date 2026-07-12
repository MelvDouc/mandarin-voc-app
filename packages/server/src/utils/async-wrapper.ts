import type { Exception, Result } from "common-types";
import { isException } from "$/utils/exceptions.ts";

export default function asyncWrapper<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  getException: (error: unknown) => Exception
) {
  return async (...args: Args): Promise<Result<T>> => {
    try {
      const data = await fn.call(args);
      return [data, null];
    } catch (error) {
      const exception = isException(error) ? error: getExeption(error);
      return [null, exception];
    }
  };
}

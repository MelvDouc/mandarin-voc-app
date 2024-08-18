import type { ResultTuple } from "$/global-types.js";
import { execute, query } from "$/server/core/Database.js";
import type { ResultSetHeader } from "mysql2";

export default class Model {
  public static asyncWrapper<T, Args extends unknown[]>(formatError?: (error: unknown) => string[]) {
    return (method: (...args: Args) => Promise<ResultTuple<T>>, ctx: ClassMethodDecoratorContext<Model>) => {
      ctx.addInitializer(function () {
        const wrappedMethod = async (...args: Args): Promise<ResultTuple<T>> => {
          try {
            return await method.apply(this, args);
          } catch (error) {
            const e = formatError
              ? formatError(error)
              : error instanceof Error
                ? [error.message]
                : [String(error)];
            return [null, e];
          }
        };
        Object.defineProperty(this, ctx.name, { value: wrappedMethod });
      });
    };
  }

  protected async query<T>(sql: string, values?: unknown[]) {
    const result = await query(sql, values) as [T[], unknown];
    return result[0];
  }

  protected async execute(sql: string, values?: unknown[]) {
    const result = await execute<ResultSetHeader>(sql, values);
    return result[0];
  }

  protected asTuple<T>(value: T): ResultTuple<T> {
    return [value, null];
  }

  protected nullTuple() {
    return this.asTuple(null);
  }
}
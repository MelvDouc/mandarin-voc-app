import router from "$/server/core/router.js";
import type { Request, Response } from "express";

export default abstract class Controller {
  private static readonly queue: {
    path: string;
    method: string;
    handler: Handler;
  }[] = [];

  public static Prefix(prefix = "") {
    return (target: typeof Controller, ctx: ClassDecoratorContext) => {
      ctx.addInitializer(() => {
        target.queue.forEach(({ path, method, handler }) => {
          router[method as "get"](prefix + path, handler.bind(target.prototype));
        });
        target.queue.length = 0;
      });
    };
  }

  private static Route(path: string, method: string) {
    return (handler: Handler, _ctx: ClassMethodDecoratorContext) => {
      this.queue.push({ path, method, handler });
    };
  }

  public static Get(path: string) {
    return this.Route(path, "get");
  }

  public static Post(path: string) {
    return this.Route(path, "post");
  }

  public static Patch(path: string) {
    return this.Route(path, "patch");
  }

  public static Delete(path: string) {
    return this.Route(path, "delete");
  }
}

type Handler = (req: Request, res: Response) => unknown;
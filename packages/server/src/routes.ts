import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import { Parser } from "zhml";

const router = new Hono();

router.get("/topics/:topic", async (ctx) => {
  const topic = ctx.req.param("topic");
  const text = await readFile(`topics/${topic}.zh`, "utf-8");
  const parser = new Parser(text);

  return ctx.json(parser.parse());
});

export { router };

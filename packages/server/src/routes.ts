import { query } from "$/database.ts";
import topicModel from "$/models/topic.model.ts";
import { type Topic } from "common-types";
import { Hono } from "hono";
import { Parser, type Node as ZhmlNode } from "zhml";

const router = new Hono();
const cache = new Map<string, CachedTopic>();

router.get("/topics", async (ctx) => {
  const { rows } = await query<Pick<Topic, "slug" | "title">>("SELECT slug, title FROM topics");

  ctx.header("Cache-Control", "public, max-age=60");
  return ctx.json(rows);
});

router.post("/topics", async (ctx) => {
  const data = await ctx.req.json();
  return ctx.json(await topicModel.add(data));
});

router.get("/topics/@/:slug", async (ctx) => {
  const slug = ctx.req.param("slug");

  if (cache.has(slug)) {
    const topic = cache.get(slug) as CachedTopic;
    return ctx.json([topic, null]);
  }

  const [topic, exception] = await topicModel.get(slug);

  if (exception)
    return ctx.json([null, exception]);

  const nodes = new Parser(topic.zhml).parse();
  const cachedTopic = { slug, title: topic.title, nodes };
  cache.set(slug, cachedTopic);

  ctx.header("Cache-Control", "public, max-age=60");
  return ctx.json([cachedTopic, null]);
});

router.patch("/topics/@/:slug", async (ctx) => {
  const slug = ctx.req.param("slug");
  const data = await ctx.req.json();
  return ctx.json(await topicModel.update(slug, data));
});

router.delete("/topics/@/:slug", async (ctx) => {
  const slug = ctx.req.param("slug");
  return ctx.json(await topicModel.delete(slug));
});

export { router };

type CachedTopic = Pick<Topic, "slug" | "title"> & {
  nodes: ZhmlNode[];
};

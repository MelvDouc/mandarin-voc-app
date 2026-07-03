import { query } from "$/database.ts";
import { Hono } from "hono";
import { Parser, type Node as ZhmlNode } from "zhml";

const router = new Hono();
const cache = new Map<string, ZhmlNode[]>();

router.get("/topics", async (ctx) => {
  const { rows } = await query<Pick<Topic, "slug">>("SELECT slug FROM topics");
  return ctx.json(rows.map(({ slug }) => slug));
});

router.get("/topics/@/:slug", async (ctx) => {
  const slug = ctx.req.param("slug");

  if (cache.has(slug)) {
    const nodes = cache.get(slug) as ZhmlNode[];
    return ctx.json(nodes);
  }

  const { rows } = await query<Topic>("SELECT * FROM topics WHERE slug = $1", [slug]);

  if (rows.length === 0)
    return ctx.json(null);

  const nodes = new Parser(rows[0].zhml).parse();
  cache.set(slug, nodes);
  return ctx.json(nodes);
});

router.get("/topics/new", async (ctx) => {
  const topic = await ctx.req.json() as Topic;
  const insert = await query("INSERT INTO topics (slug, zhml) VALUES ($1, $2)", [topic.slug, topic.zhml]);
  return ctx.json({ ok: true });
});

router.get("/topics/update/:slug", async (ctx) => {
  const slug = ctx.req.param("slug");
  const topic = await ctx.req.json() as Topic;
  const update = await query("UPDATE topics SET slug = $1, zhml = $2 WHERE slug = $3", [topic.slug, topic.zhml, slug]);
  cache.delete(slug);
  return ctx.json({ ok: true });
});

export { router };

type Topic = {
  slug: string;
  zhml: string;
};
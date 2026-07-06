import { query } from "$/database.ts";
import { Hono } from "hono";
import { Parser, type Node as ZhmlNode } from "zhml";

const router = new Hono();
const cache = new Map<string, CachedTopic>();

router.get("/topics", async (ctx) => {
  const { rows } = await query<Pick<Topic, "slug" | "title">>("SELECT slug, title FROM topics");

  ctx.header("Cache-Control", "public, max-age=60");
  return ctx.json(rows);
});

router.get("/topics/@/:slug", async (ctx) => {
  const slug = ctx.req.param("slug");

  if (cache.has(slug)) {
    const nodes = cache.get(slug) as CachedTopic;
    return ctx.json(nodes);
  }

  const { rows } = await query<Topic>("SELECT * FROM topics WHERE slug = $1", [slug]);

  if (rows.length === 0)
    return ctx.json(null);

  const nodes = new Parser(rows[0].zhml).parse();
  const topic = { slug, title: rows[0].title, nodes };
  cache.set(slug, topic);

  ctx.header("Cache-Control", "public, max-age=60");
  return ctx.json(topic);
});

router.get("/topics/@/:slug/update", async (ctx) => {
  const slug = ctx.req.param("slug");
  const topic = await ctx.req.json() as Topic;
  const update = await query(`
    UPDATE topics
    SET slug = $1, title = $2, zhml = $3
    WHERE slug = $4
  `, [topic.slug, topic.title, topic.zhml, slug]);
  cache.delete(slug);
  return ctx.json({ ok: true });
});

router.get("/topics/new", async (ctx) => {
  const topic = await ctx.req.json() as Topic;
  const insert = await query(
    "INSERT INTO topics (slug, title, zhml) VALUES ($1, $2, $3)",
    [topic.slug, topic.title, topic.zhml]
  );
  return ctx.json({ ok: true });
});

export { router };

type Topic = {
  slug: string;
  title: string;
  zhml: string;
};

type CachedTopic = {
  slug: string;
  title: string;
  nodes: ZhmlNode[];
};
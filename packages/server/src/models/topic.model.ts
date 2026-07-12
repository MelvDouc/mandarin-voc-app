import { query } from "$/database.ts";
import asyncWrapper from "$/utils/async-wrapper.ts";
import { ExceptionKind, type Topic } from "common-types";
import { Parser } from "zhml";
import { z } from "zod";

const SlugSchema = z
  .string()
  .nonempty({ error: "A slug is required.", abort: true })
  .max(50, { error: "A slug must be 50 characters long maximum." })
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { error: "A slug must consist of lowercase letters and digits joined by dashes." });

const TitleSchema = z
  .string()
  .nonempty({ error: "A title is required." })
  .max(255, { error: "A title must be 255 characters long maximum." });

const ZhmlSchema = z
  .string()
  .nonempty({ error: "ZHML is required.", abort: true })
  .superRefine((value, ctx) => {
    try {
      new Parser(value).parse();
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message: error instanceof Error ? error.message : "Invalid ZHML."
      });
    }
  });

const AddTopicSchema = z.object({
  slug: SlugSchema.refine(isUniqueSlug, { error: "This slug is already in use." }),
  title: TitleSchema,
  zhml: ZhmlSchema
});

const UpdateTopicSchema = z.object({
  slug: SlugSchema,
  title: TitleSchema,
  zhml: ZhmlSchema
});

async function isUniqueSlug(slug: string): Promise<boolean> {
  const { rows } = await query("SELECT 1 FROM topics WHERE slug = $1", [slug]);
  return rows.length === 0;
}

const getTopic = asyncWrapper(
  async (slug: string) => {
    const { rows } = await query<Topic>("SELECT * FROM topics WHERE slug = $1", [slug]);

    if (rows.length === 0)
      throw { kind: ExceptionKind.NotFound };

    return rows[0];
  },
  () => ({ kind: ExceptionKind.Database, message: "Topic is unavailable." })
);

const addTopic = asyncWrapper(
  async (data: unknown) => {
    // TODO: check what zod throws.
    const topic = await AddTopicSchema.parseAsync(data);
    await query(
      "INSERT INTO topics (slug, title, zhml) VALUES ($1, $2, $3)",
      [topic.slug, topic.title, topic.zhml]
    );
    return true;
  },
  () => ({ kind: ExceptionKind.Database, message: "Topic could not be added." })
);


const updateTopic = asyncWrapper(
  async (slug: string, data: unknown) => {
    const topic = await UpdateTopicSchema.parseAsync(data);

    if (slug !== topic.slug && !(await isUniqueSlug(topic.slug)))
      throw { kind: ExceptionKind.Form, message: { slug: "This slug is already in use." } };

    await query(`
      UPDATE topics
      SET slug = $1, title = $2, zhml = $3
      WHERE slug = $4
    `, [topic.slug, topic.title, topic.zhml, slug]);
    return true;
  },
  () => ({ kind: ExceptionKind.Database, message: "Topic could not be updated." })
);

const deleteTopic = asyncWrapper(
  async (slug: string) => {
    await query("DELETE FROM topics WHERE slug = $1", [slug]);
    return true;
  },
  () => ({ kind: ExceptionKind.Database, message: "Topic could not be deleted." })
);

export default {
  get: getTopic,
  add: addTopic,
  update: updateTopic,
  delete: deleteTopic
};

import type { Topic, WithoutId } from "$/global-types.js";
import Model from "$/server/core/Model.js";
import { deleteFrom, insertInto, jsonObject, selectFrom, update } from "mysql-query-maker";

class TopicModel extends Model {
  private readonly _table = "topic";

  private _getSelectAllBuilder() {
    const categoryObject = jsonObject({ id: "c.id", name: "c.name" });
    const tagObject = jsonObject({ id: "tag.id", value: "tag.value" });
    return selectFrom(`${this._table} t`)
      .column("t.id id")
      .column("t.title title")
      .column("t.content content")
      .column("t.slug slug")
      .columnIf("c.id IS NULL", "NULL", categoryObject, "category")
      .columnIf("tag.id IS NULL", "JSON_ARRAY()", `JSON_ARRAYAGG(${tagObject})`, "tags")
      .join.left("category c", "c.id = t.category_id")
      .join.left("topic_tag tt", "tt.topic_id = t.id")
      .join.left("tag", "tag.id = tt.tag_id")
      .groupBy("t.id", "tag.id")
      .orderBy("t.title");
  }

  @Model.asyncWrapper(() => ["Topics unavailable."])
  async findAll() {
    const sql = this._getSelectAllBuilder().getSql();
    const topics = await this.query<Topic>(sql);
    return this.asTuple(topics);
  }

  @Model.asyncWrapper((e) => (console.log(e), []))
  async findOneById(id: number) {
    const topics = await this.query<Topic>(
      this._getSelectAllBuilder()
        .where("t.id = :id")
        .getSql({ id })
    );
    return this.asTuple(topics[0] ?? null);
  }

  @Model.asyncWrapper()
  async findOneBySlug(slug: string) {
    const topics = await this.query<Topic>(
      this._getSelectAllBuilder()
        .where("t.slug = :slug")
        .getSql({ slug })
    );
    return this.asTuple(topics[0] ?? null);
  }

  @Model.asyncWrapper()
  async add(topic: WithoutId<Topic>) {
    const header = await this.execute(
      insertInto(this._table)
        .columns(["slug", "title", "content", "category_id"])
        .value([
          topic.slug,
          topic.title,
          topic.content,
          topic.category?.id ?? null
        ])
        .getSql()
    );
    return this.asTuple(header.insertId);
  }

  @Model.asyncWrapper()
  async update(topic: Omit<Topic, "tags">) {
    const sql = update(this._table)
      .set("slug", ":slug")
      .set("title", ":title")
      .set("content", ":content")
      .set("category_id", ":ci")
      .where("id = :id")
      .getSql({
        slug: topic.slug,
        title: topic.title,
        content: topic.content,
        ci: topic.category?.id ?? null,
        id: topic.id
      });
    await this.execute(sql);
    return this.nullTuple();
  }

  async delete(id: number) {
    await this.execute(
      deleteFrom(this._table)
        .where("id = :id")
        .getSql({ id })
    );
    return this.nullTuple();
  }
}

const topicModel = new TopicModel();
export default topicModel;
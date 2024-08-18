import type { Tag, WithoutId } from "$/global-types.js";
import Model from "$/server/core/Model.js";
import { deleteFrom, insertInto, selectFrom, update } from "mysql-query-maker";

class TagModel extends Model {
  @Model.asyncWrapper()
  async findAll() {
    const tags = await this.query<Tag>(
      selectFrom("tag")
        .column("*")
        .orderBy("id")
        .getSql()
    );
    return this.asTuple(tags);
  }

  @Model.asyncWrapper()
  async findByValue(value: string) {
    const tags = await this.query<Tag>(
      selectFrom("tag")
        .column("*")
        .where("value = :value")
        .getSql({ value })
    );
    return this.asTuple(tags);
  }

  @Model.asyncWrapper()
  async add(tag: WithoutId<Tag>) {
    const header = await this.execute(
      insertInto("tag")
        .columns(["value"])
        .value([tag.value])
        .getSql()
    );
    return this.asTuple(header.insertId);
  }

  @Model.asyncWrapper((error) => {
    if (error instanceof Error && error.message.startsWith("Duplicate"))
      return ["Tag value already in use."];
    return [String(error)];
  })
  async update(tag: Tag) {
    await this.execute(
      update("tag")
        .set("value", ":value")
        .where("id = :id")
        .getSql({
          value: tag.value,
          id: tag.id
        })
    );
    return this.nullTuple();
  }

  @Model.asyncWrapper()
  async delete(id: number) {
    await this.execute(
      deleteFrom("tag")
        .where("id = :id")
        .getSql({ id })
    );
    return this.nullTuple();
  }

  @Model.asyncWrapper()
  async setTopicTag(tagId: number, topicId: number) {
    await this.execute(
      insertInto("topic_tag")
        .columns(["tag_id", "topic_id"])
        .value([tagId, topicId])
        .getSql()
    );
    return this.nullTuple();
  }

  @Model.asyncWrapper()
  async unsetTopicTag(tagId: number, topicId: number) {
    await this.execute(
      deleteFrom("topic_tag")
        .where("tag_id = :tagId AND topic_id = :topicId")
        .getSql({ tagId, topicId })
    );
    return this.nullTuple();
  }
}

const tagModel = new TagModel();
export default tagModel;
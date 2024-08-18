import type { Category, WithoutId } from "$/global-types.js";
import Model from "$/server/core/Model.js";
import { deleteFrom, insertInto, selectFrom, update } from "mysql-query-maker";

class CategoryModel extends Model {
  @Model.asyncWrapper(() => ["Categories unavailable."])
  async findAll() {
    const categories = await this.query<Category>(
      selectFrom("category")
        .column("*")
        .getSql()
    );
    return this.asTuple(categories);
  }

  @Model.asyncWrapper()
  async findOneById(id: number) {
    const categories = await this.query<Category>(
      selectFrom("category")
        .column("*")
        .where("id = :id")
        .getSql({ id })
    );
    return this.asTuple(categories[0] ?? null);
  }

  @Model.asyncWrapper()
  async add(category: WithoutId<Category>) {
    const header = await this.execute(
      insertInto("category")
        .columns(["name"])
        .value([category.name])
        .getSql()
    );
    return this.asTuple(header.insertId);
  }

  @Model.asyncWrapper()
  async update(category: Category) {
    await this.execute(
      update("category")
        .set("name", ":name")
        .where("id = :id")
        .getSql({
          name: category.name,
          id: category.id
        })
    );
    return this.nullTuple();
  }

  @Model.asyncWrapper()
  async delete(id: number) {
    await this.execute(
      deleteFrom("category")
        .where("id = :id")
        .getSql({ id })
    );
    return this.nullTuple();
  }
}

const categoryModel = new CategoryModel();
export default categoryModel;
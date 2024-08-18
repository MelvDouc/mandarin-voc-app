import Button from "$/client/components/Button/Button.jsx";
import api from "$/client/utils/api.js";
import type { Category } from "$/global-types.js";

export default async function CategoryListPage() {
  const [categories, error] = await api.get<Category[]>("/categories");

  if (error)
    return (<p>Categories unavailable.</p>);

  return (
    <>
      <h1>Categories</h1>
      <Button style={{ marginBottom: "var(--gap2)" }} color="blue">
        <a href="/admin/categories/add">Add</a>
      </Button>
      <ul>
        {categories.map((category) => (
          <li>
            <a href={`/admin/categories/update/${category.id}`}>{category.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
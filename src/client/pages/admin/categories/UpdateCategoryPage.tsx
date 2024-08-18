import Button from "$/client/components/Button/Button.jsx";
import { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import CategoryForm from "$/client/components/forms/CategoryForm.jsx";
import { addFlashMessage } from "$/client/state/flash-messages.js";
import type { Category, WithoutId } from "$/client/types.js";
import api from "$/client/utils/api.js";
import { navigate } from "client-side-router";

export default async function UpdateCategoryPage({ id }: {
  id: string;
}) {
  const [category] = await api.get<Category | null>(`/categories/${id}`);

  if (!category)
    return (<p>Category not found.</p>);

  const errorObs = createErrorObs();

  return (
    <>
      <h1>Update a category</h1>
      <CategoryForm
        category={category}
        handleSubmit={(category) => handleSubmit(+id, category, errorObs)}
        errorObs={errorObs}
      />
      <Button color="red" onclick={() => deleteCategory(category.id, errorObs)}>Delete category</Button>
    </>
  );
}

async function handleSubmit(id: number, category: WithoutId<Category>, errorObs: ErrorObs) {
  const [_, error] = await api.patch(`/categories/${id}`, category);
  if (error) {
    errorObs.value = error;
    return;
  }
  addFlashMessage("success", "The category was updated successfully.");
  navigate("/admin/categories");
}

async function deleteCategory(id: number, errorObs: ErrorObs) {
  if (!confirm("Are you sure you want to delete this category?"))
    return;
  const [_, error] = await api.delete(`/categories/${id}`);
  if (error) {
    errorObs.value = error;
    return;
  }
  addFlashMessage("success", "The category was deleted successfully.");
  navigate("/admin/categories");
}
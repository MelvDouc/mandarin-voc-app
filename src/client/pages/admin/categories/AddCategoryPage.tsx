import { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import CategoryForm from "$/client/components/forms/CategoryForm.jsx";
import { addFlashMessage } from "$/client/state/flash-messages.js";
import type { Category, WithoutId } from "$/client/types.js";
import api from "$/client/utils/api.js";
import { navigate } from "client-side-router";

export default function AddCategoryPage() {
  const errorObs = createErrorObs();
  return (
    <>
      <h1>Add a category</h1>
      <CategoryForm
        category={null}
        handleSubmit={(category) => handleSubmit(category, errorObs)}
        errorObs={errorObs}
      />
    </>
  );
}

async function handleSubmit(category: WithoutId<Category>, errorObs: ErrorObs) {
  const [_, error] = await api.post<number>("/categories", category);
  if (error) {
    errorObs.value = error;
    return;
  }
  addFlashMessage("success", "The category was added successfully.");
  navigate("/admin/categories");
}
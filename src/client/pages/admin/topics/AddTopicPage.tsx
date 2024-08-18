import { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import TopicForm from "$/client/components/forms/TopicForm.js";
import { addFlashMessage } from "$/client/state/flash-messages.js";
import type { Category, Tag, Topic, WithoutId } from "$/client/types.js";
import api from "$/client/utils/api.js";

export default async function AddTopicPage() {
  const [categories] = await api.get<Category[]>("/categories");
  const [tags] = await api.get<Tag[]>("/tags");
  const errorObs = createErrorObs();

  return (
    <>
      <h1>Add a topic</h1>
      <TopicForm
        topic={null}
        categories={categories ?? []}
        tags={tags ?? []}
        handleSubmit={(topic) => handleSubmit(topic, errorObs)}
        errorObs={errorObs}
      />
    </>
  );
}

async function handleSubmit(topic: WithoutId<Topic>, errorObs: ErrorObs) {
  const [_, error] = await api.post("/topics", topic);
  if (error) {
    errorObs.value = error;
    return;
  }
  addFlashMessage("success", "The topic was added successfully.");
  location.assign(`/topics/${topic.slug}`);
}
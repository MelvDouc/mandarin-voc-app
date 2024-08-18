import Button from "$/client/components/Button/Button.jsx";
import { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import TopicForm from "$/client/components/forms/TopicForm.js";
import type { Category, Tag, Topic, WithoutId } from "$/client/types.js";
import api from "$/client/utils/api.js";
import { navigate } from "client-side-router";

export default async function UpdateTopicPage({ id }: {
  id: string;
}) {
  const [topic, error] = await api.get<Topic>(`/topics/one?id=${id}`);

  if (error)
    return (<p>Topic not found.</p>);

  const errorObs = createErrorObs();
  const [categories] = await api.get<Category[]>("/categories");
  const [tags] = await api.get<Tag[]>("/tags");

  return (
    <>
      <h1>Update a topic</h1>
      <TopicForm
        topic={topic}
        categories={categories ?? []}
        tags={tags ?? []}
        handleSubmit={(t) => handleSubmit(topic.id, t, errorObs)}
        errorObs={errorObs}
      />
      <Button color="red" onclick={() => deleteTopic(topic.id, errorObs)}>Delete topic</Button>
    </>
  );
}

async function handleSubmit(id: number, topic: WithoutId<Topic>, errorObs: ErrorObs) {
  const [_, error] = await api.patch(`/topics/${id}`, topic);
  if (error) {
    errorObs.value = error;
    return;
  }
  navigate(`/topics/${topic.slug}`);
}

async function deleteTopic(topicId: number, errorObs: ErrorObs) {
  if (!confirm("Are you sure you want to delete this topic?"))
    return;
  const [_, error] = await api.delete(`/topics/${topicId}`);
  if (error) {
    errorObs.value = error;
    return;
  }
  navigate("/admin/topics");
}
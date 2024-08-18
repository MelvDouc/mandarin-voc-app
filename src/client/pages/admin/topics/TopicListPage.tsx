import Button from "$/client/components/Button/Button.jsx";
import api from "$/client/utils/api.js";
import type { Topic } from "$/global-types.js";

export default async function TopicListPage() {
  const [topics, error] = await api.get<Topic[]>("/topics");

  if (error)
    return (<p>Topics unavailable.</p>);

  return (
    <>
      <h1>Topics</h1>
      <Button style={{ marginBottom: "var(--gap2)" }} color="blue"><a href="/admin/topics/add">Add</a></Button>
      <ul>
        {topics.map((topic) => (
          <li>
            <a href={`/admin/topics/update/${topic.id}`}>{topic.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
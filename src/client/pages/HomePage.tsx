import type { Topic } from "$/client/types.js";
import api from "$/client/utils/api.js";

export default async function HomePage() {
  const [topics, error] = await api.get<Topic[]>("/topics");

  if (error)
    return (<p>Topics unavailable.</p>);

  return (
    <>
      <h1>Home</h1>
      <h2>Topics</h2>
      <ul>
        {topics.map(({ title, slug }) => (
          <li>
            <a href={`/topics/${slug}`}>{title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
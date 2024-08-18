import TopicBlock from "$/client/components/TopicBlock/TopicBlock.jsx";
import type { Topic } from "$/client/types.js";
import api from "$/client/utils/api.js";

export default async function TopicPage({ slug }: {
  slug: string;
}) {
  const [topic] = await api.get<Topic | null>(`/topics/one?slug=${slug}`);

  if (!topic)
    return (<p>Topic not found.</p>);

  return (
    <>
      <h1>{topic.title}</h1>
      <TopicBlock topic={topic} />
    </>
  );
}
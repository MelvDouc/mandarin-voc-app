import TopicCard from "$/components/TopicCard/TopicCard";
import useApi from "$/hooks/useApi.ts";
import useDocumentTitle from "$/hooks/useDocumentTitle.ts";
import type { Topic, ZhmlBlockElementNode, ZhmlExampleListNode } from "$/types.ts";
import { useParams } from "react-router-dom";

export default function TopicPage() {
  const slug = useParams().slug as string;
  const data = useApi<ApiTopic>(`/topics/@/${slug}`);
  useDocumentTitle(data?.title);

  if (!data)
    return null;

  return (
    <>
      <h1>{data.title}</h1>
      <TopicCard nodes={data.nodes} />
    </>
  );
}

type ApiTopic = Pick<Topic, "title" | "slug"> & {
  nodes: (ZhmlBlockElementNode | ZhmlExampleListNode)[];
};
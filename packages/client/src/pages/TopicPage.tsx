import ZhCard from "$/components/ZhCard/ZhCard";
import useApi from "$/hooks/useApi.ts";
import useDocumentTitle from "$/hooks/useDocumentTitle.ts";
import type { Topic, ZhmlBlockElementNode, ZhmlExampleListNode } from "$/types.ts";
import { useParams } from "react-router-dom";

export default function TopicPage() {
  const slug = useParams().slug as string;
  useDocumentTitle(slug);

  const data = useApi<ApiTopic>(`/topics/@/${slug}`);

  if (!data)
    return null;

  return (
    <>
      <h1>{data.title}</h1>
      <ZhCard nodes={data.nodes} />
    </>
  );
}

type ApiTopic = Pick<Topic, "title" | "slug"> & {
  nodes: (ZhmlBlockElementNode | ZhmlExampleListNode)[];
};
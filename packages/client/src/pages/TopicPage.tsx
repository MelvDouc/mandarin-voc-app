import ZhCard from "$/components/ZhCard/ZhCard";
import useApi from "$/hooks/useApi.ts";
import useDocumentTitle from "$/hooks/useDocumentTitle.ts";
import type { ZhmlBlockElementNode, ZhmlExampleListNode } from "$/types.ts";
import { useParams } from "react-router-dom";

export default function TopicPage() {
  const slug = useParams().slug as string;
  useDocumentTitle(slug);

  const nodes = useApi<(ZhmlBlockElementNode | ZhmlExampleListNode)[]>(`/topics/@/${slug}`);

  if (!nodes)
    return null;

  return (
    <ZhCard nodes={nodes} />
  );
}
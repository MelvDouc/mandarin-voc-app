import useApi from "$/hooks/useApi.ts";
import type { Node as ZhmlNode } from "zhml";

export default function App() {
  const data = useApi<ZhmlNode[]>("/topics/qilai");

  return (
    <pre>{JSON.stringify(data, null, 4)}</pre>
  );
}
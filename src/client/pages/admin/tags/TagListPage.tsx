import TagTable from "$/client/components/TagTable/TagTable.jsx";
import type { Tag } from "$/client/types.js";
import api from "$/client/utils/api.js";

export default async function TagListPage() {
  const [tags, error] = await api.get<Tag[]>("/tags");

  if (error)
    return (<p>Tags unavailable.</p>);

  return (
    <>
      <h1>Tags</h1>
      <TagTable tags={tags} />
    </>
  );
}
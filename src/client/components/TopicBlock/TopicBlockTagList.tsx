import type { Tag } from "$/client/types.js";

export default function TopicBlockTagList({ tags }: {
  tags: Tag[];
}) {
  return (
    <ul>
      {tags.map(({ value }) => (
        <li>{value}</li>
      ))}
    </ul>
  );
}
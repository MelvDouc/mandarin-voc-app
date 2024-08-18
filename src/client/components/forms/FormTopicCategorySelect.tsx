import type { Category, Topic, WithoutId } from "$/client/types.js";

export default function FormTopicCategorySelect({ id, topic, categories }: {
  id: string;
  topic: WithoutId<Topic>;
  categories: Category[];
}) {
  const memo = categories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {} as Record<number, Category>);

  const handleChange = ({ target }: Event) => {
    const id = +(target as HTMLSelectElement).value;
    topic.category = id === 0 ? null : memo[id];
  };

  return (
    <select id={id} onchange={handleChange}>
      <option value="0" selected={topic.category === null}>(none)</option>
      {categories.map(({ id, name }) => (
        <option value={id.toString()} selected={id === topic.category?.id}>{name}</option>
      ))}
    </select>
  );
}
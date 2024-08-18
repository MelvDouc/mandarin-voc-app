import TopicBlockTagList from "$/client/components/TopicBlock/TopicBlockTagList.jsx";
import XmlNodes from "$/client/components/TopicBlock/XmlNodes.jsx";
import type { Topic } from "$/client/types.js";
import cssClasses from "./TopicBlock.module.scss";

export default function TopicBlock({ topic }: {
  topic: Topic;
}) {
  return (
    <div className={cssClasses.TopicBlock}>
      <XmlNodes xml={topic.content} />
      <h2>Category</h2>
      <p>{topic.category ? topic.category.name : (<i>none</i>)}</p>
      {topic.tags.length > 0 && (
        <>
          <h2>Tags</h2>
          <TopicBlockTagList tags={topic.tags} />
        </>
      )}
    </div>
  );
}
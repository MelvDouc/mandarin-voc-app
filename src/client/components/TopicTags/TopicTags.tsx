import type { ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import type { Tag, Topic } from "$/client/types.js";
import api from "$/client/utils/api.js";
import cssClasses from "./TopicTags.module.scss";

export default function TopicTags({ topic, tags, errorObs }: {
  topic: Topic;
  tags: Tag[];
  errorObs: ErrorObs;
}) {
  return (
    <div className={cssClasses.TopicTags}>{tags.map((tag) => (
      <span
        className={{
          [cssClasses.TopicTag]: true,
          [cssClasses.on]: topic.tags.some(({ id }) => id === tag.id)
        }}
        onclick={createToggler(tag, topic, errorObs)}
      >{tag.value}</span>
    ))}</div>
  );
}

function createToggler(tag: Tag, topic: Topic, errorObs: ErrorObs) {
  const apiUrl = `/tags/toggle-topic/${tag.id}` as `/${string}`;

  return async ({ target }: Event) => {
    const { classList } = target as HTMLElement;
    const index = topic.tags.findIndex(({ id }) => id === tag.id);

    if (index === -1) {
      const [_, error] = await api.post(apiUrl, { action: "set", topicId: topic.id });
      if (error) {
        errorObs.value = error;
      } else {
        topic.tags.push(tag);
        classList.add(cssClasses.on);
      }
      return;
    }

    const [_, error] = await api.post(apiUrl, { action: "unset", topicId: topic.id });
    if (error) {
      errorObs.value = error;
    } else {
      topic.tags.splice(index, 1);
      classList.remove(cssClasses.on);
    }
  };
}
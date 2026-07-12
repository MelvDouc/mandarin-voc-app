import useApi from "$/hooks/useApi.ts";
import { Link } from "react-router-dom";
import cssClasses from "./TopicList.module.scss";

export default function TopicList() {
  const [data] = useApi<{ slug: string; title: string; }[]>("/topics");

  if (!data)
    return null;

  return (
    <ul className={cssClasses.TopicList}>
      {data.map(({ slug, title }) => (
        <li key={slug}>
          <Link to={`/topics/@/${slug}`}>{title}</Link>
        </li>
      ))}
    </ul>
  );
}
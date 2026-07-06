import useApi from "$/hooks/useApi.ts";
import useDocumentTitle from "$/hooks/useDocumentTitle.ts";
import type { Topic } from "$/types.ts";
import { Link } from "react-router-dom";

export default function HomePage() {
  useDocumentTitle("Home");

  const slugs = useApi<Pick<Topic, "slug" | "title">[]>("/topics");

  return (
    <>
      <h1>Home page</h1>

      {slugs && (
        <>
          <h2>Topics</h2>

          <ul>
            {slugs.map(({ slug, title }) => (
              <li key={slug}><Link to={`/topics/@/${slug}`}>{title}</Link></li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
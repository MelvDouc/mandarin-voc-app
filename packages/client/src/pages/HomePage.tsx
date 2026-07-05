import useApi from "$/hooks/useApi.ts";
import useDocumentTitle from "$/hooks/useDocumentTitle.ts";
import { Link } from "react-router-dom";

export default function HomePage() {
  useDocumentTitle("Home");

  const slugs = useApi<string[]>("/topics");

  return (
    <>
      <h1>Home page</h1>

      {slugs && (
        <>
          <h2>Topics</h2>

          <ul>
            {slugs.map((slug, i) => (
              <li key={i}><Link to={`/topics/@/${slug}`}>{slug}</Link></li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
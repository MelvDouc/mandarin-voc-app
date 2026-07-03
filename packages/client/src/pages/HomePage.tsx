import useDocumentTitle from "$/hooks/useDocumentTitle.ts";

export default function HomePage() {
  useDocumentTitle("Home");

  return (
    <h1>Home page</h1>
  );
}
import useDocumentTitle from "$/hooks/useDocumentTitle.ts";

export default function HomePage() {
  useDocumentTitle("Home");

  return (
    <p>Home page</p>
  );
}
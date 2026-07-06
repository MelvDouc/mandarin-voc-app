import TopicList from "$/components/TopicList/TopicList.tsx";
import { Link } from "react-router-dom";
import cssClasses from "./Sidebar.module.scss";

export default function Sidebar() {
  return (
    <aside className={cssClasses.Sidebar}>
      <section>
        <h2>Pages</h2>
        <div>
          <Link to="/">Home</Link>
        </div>
      </section>

      <section>
        <h2>Topics</h2>
        <TopicList />
      </section>
    </aside>
  );
}
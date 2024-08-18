import auth from "$/client/state/auth.js";
import cssClasses from "./Header.module.scss";

export default function Header() {
  return (
    <header className={cssClasses.Header}>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/resources">Resources</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
        <div className={cssClasses.LogIn}>
          {auth.map((email) => (
            email ?? (<a href="/log-in">Log in</a>)
          ))}
        </div>
      </nav>
    </header>
  );
}
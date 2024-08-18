import App from "$/client/App.js";
import "$/client/main.scss";
import auth from "$/client/state/auth.js";
import "reactfree-jsx";

auth.init().then(() => {
  document.body.appendChild(App());
});
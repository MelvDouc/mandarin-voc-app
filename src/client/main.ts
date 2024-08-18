import App from "$/client/App.js";
import "$/client/main.scss";
import auth from "$/client/state/auth.js";
import "reactfree-jsx";

await auth.init();
document.body.appendChild(App());
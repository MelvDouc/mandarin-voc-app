import api from "$/client/utils/api.js";
import { obs } from "reactfree-jsx";

const authObs = obs<string | null>(null);

const subscribe = authObs.subscribe.bind(authObs);
const map = authObs.map.bind(authObs);
const isLoggedIn = () => authObs.value !== null;

const setEmail = (email: string) => {
  authObs.value = email;
};

const init = async () => {
  const [email, error] = await api.get<string>("/auth/check-log-in");
  authObs.value = error ? null : email;
};

const logOut = () => {
  authObs.value = null;
};

export default {
  subscribe,
  map,
  isLoggedIn,
  init,
  setEmail,
  logOut,
};
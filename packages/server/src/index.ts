import { router } from "$/routes.ts";
import { Hono } from "hono";

const app = new Hono();
const port = +Bun.env.PORT;

if (Bun.env.NODE_ENV === "development") {
  const { cors } = await import("hono/cors");
  app.use("*", cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
}

app.get("/health", (ctx) => ctx.newResponse(null, 200));
app.route("/api/v1", router);

export default {
  fetch: app.fetch,
  port
};
import { router } from "$/routes.ts";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
const port = +process.env.PORT;

if (process.env.NODE_ENV === "development") {
  const { cors } = await import("hono/cors");
  app.use("*", cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
}

app.get("/health", (ctx) => ctx.newResponse(null, 200));
app.route("/api/v1", router);

(() => {
  console.log(`App running at http://localhost:${port}`);
  serve({ fetch: app.fetch, port: port });
})();
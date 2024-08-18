import { router } from "$/server/core/routes.js";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import express from "express";
import ViteExpress from "vite-express";

const app = express();
const port = Number(process.env.PORT ?? process.env.Port ?? process.env.port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(router);

ViteExpress.listen(app, port, () => {
  console.log(
    chalk.magenta(`App running at ${chalk.cyan.underline(process.env.HOST)}`)
  );
});
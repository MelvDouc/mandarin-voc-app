declare module "bun" {
  interface Env {
    readonly PORT: string;
    readonly NODE_ENV: "development" | "production";
  }
}
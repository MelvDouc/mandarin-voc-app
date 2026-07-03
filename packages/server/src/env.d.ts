declare module "bun" {
  interface Env {
    readonly PORT: string;
    readonly NODE_ENV: "development" | "production";
    readonly POSTGRES_DB: string;
    readonly POSTGRES_USER: string;
    readonly POSTGRES_PASSWORD: string;
  }
}
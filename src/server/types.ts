declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly HOST: string;
      readonly COOKIE_SECRET: string;
      readonly DB_URI: string;
      readonly JWT_SECRET: string;
      readonly NODEMAILER_APP_USER: string;
      readonly NODEMAILER_APP_PASSWORD: string;
    }
  }
}

export { };

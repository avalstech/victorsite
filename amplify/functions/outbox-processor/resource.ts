import { defineFunction, secret } from "@aws-amplify/backend";

export const outboxProcessor = defineFunction({
  name: "outboxProcessor",
  entry: "./handler.ts",
  environment: {
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL ?? "no-reply@victoranene.com",
    SITE_URL: process.env.SITE_URL ?? "http://localhost:3000"
  }
});

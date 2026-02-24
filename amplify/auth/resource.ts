import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "REPLACE_ME",
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "REPLACE_ME",
        scopes: ["openid", "email", "profile"]
      },
      callbackUrls: [process.env.SITE_URL ?? "http://localhost:3000"],
      logoutUrls: [process.env.SITE_URL ?? "http://localhost:3000"]
    }
  },
  userAttributes: {
    fullname: { required: false }
  },
  groups: ["Admin", "Editor"]
});

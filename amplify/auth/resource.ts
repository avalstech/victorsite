import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_OAUTH_CLIENT_ID"),
        clientSecret: secret("GOOGLE_OAUTH_CLIENT_SECRET"),
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

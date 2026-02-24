import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "siteStorage",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"])
    ],
    "inquiries/*": [
      allow.authenticated.to(["read", "write"]),
      allow.groups(["Admin", "Editor"]).to(["read", "write", "delete"])
    ]
  })
});

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

let client: ReturnType<typeof generateClient<Schema>> | null = null;

export const getDataClient = () => {
  if (!client) {
    try {
      client = generateClient<Schema>();
    } catch (e) {
      console.error("Failed to create data client:", e);
      // Return a mock client that throws on methods
      client = new Proxy({} as any, {
        get: () => ({
          list: () => Promise.resolve({ data: [] }),
          get: () => Promise.resolve({ data: null }),
          create: () => Promise.reject(new Error("Data client not available")),
          update: () => Promise.reject(new Error("Data client not available")),
          delete: () => Promise.reject(new Error("Data client not available"))
        })
      });
    }
  }
  return client;
};

export const dataClient = getDataClient();

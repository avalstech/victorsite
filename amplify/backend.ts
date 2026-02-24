import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { outboxProcessor } from "./functions/outbox-processor/resource";
import { rateLimitTable } from "./rate-limit/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  outboxProcessor,
  rateLimitTable
});

// Permissions: outbox processor can read/write data and send emails + access rate limit table
backend.outboxProcessor.resources.lambda.addEnvironment("SITE_URL", process.env.SITE_URL ?? "http://localhost:3000");
backend.outboxProcessor.resources.lambda.addEnvironment("RATE_LIMIT_TABLE", backend.rateLimitTable.resources.table.tableName);

backend.data.resources.cfnResources.cfnGraphqlApi.addDependency(backend.outboxProcessor.resources.lambda);

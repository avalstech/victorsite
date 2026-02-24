import { defineStorage } from "@aws-amplify/backend";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";

export const rateLimitTable = {
  resources: {
    table: new dynamodb.TableV2(undefined as any, "RateLimitTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      timeToLiveAttribute: "ttl",
      billing: dynamodb.Billing.onDemand()
    })
  }
} as any;

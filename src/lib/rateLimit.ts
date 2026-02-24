import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * Simple DynamoDB token bucket rate limiter.
 * Key: partition = "ip#<ip>#<route>".
 */
export async function rateLimitOrThrow(opts: {
  tableName: string;
  key: string;
  limit: number;
  windowSeconds: number;
}) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % opts.windowSeconds);
  const pk = `rl#${opts.key}`;
  const res = await ddb.send(
    new UpdateCommand({
      TableName: opts.tableName,
      Key: { pk, sk: `${windowStart}` },
      UpdateExpression: "ADD #count :inc SET #ttl = :ttl",
      ExpressionAttributeNames: { "#count": "count", "#ttl": "ttl" },
      ExpressionAttributeValues: { ":inc": 1, ":ttl": windowStart + opts.windowSeconds + 60 }
    })
  );
  const count = (res.Attributes?.count as number | undefined) ?? undefined;
  // UpdateCommand doesn't return Attributes unless ReturnValues is set. We'll set it.
  // This function is used by Lambda handlers below that set ReturnValues.
  return count;
}

export async function rateLimitOrThrowWithReturn(opts: {
  tableName: string;
  key: string;
  limit: number;
  windowSeconds: number;
}) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % opts.windowSeconds);
  const pk = `rl#${opts.key}`;
  const res = await ddb.send(
    new UpdateCommand({
      TableName: opts.tableName,
      Key: { pk, sk: `${windowStart}` },
      UpdateExpression: "ADD #count :inc SET #ttl = :ttl",
      ExpressionAttributeNames: { "#count": "count", "#ttl": "ttl" },
      ExpressionAttributeValues: { ":inc": 1, ":ttl": windowStart + opts.windowSeconds + 60 },
      ReturnValues: "ALL_NEW"
    })
  );
  const count = Number(res.Attributes?.count ?? 0);
  if (count > opts.limit) {
    const retryAfter = windowStart + opts.windowSeconds - Math.floor(Date.now() / 1000);
    const err = new Error("Rate limit exceeded");
    (err as any).statusCode = 429;
    (err as any).retryAfter = Math.max(1, retryAfter);
    throw err;
  }
}

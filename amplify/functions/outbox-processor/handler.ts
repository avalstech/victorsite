import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ses = new SESv2Client({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const FROM = process.env.SES_FROM_EMAIL!;
const SITE_URL = process.env.SITE_URL!;
const RATE_LIMIT_TABLE = process.env.RATE_LIMIT_TABLE;

function htmlWrap(inner: string) {
  return `<!doctype html><html><body style="font-family: Arial, sans-serif; color:#0f172a; line-height:1.5">
  <div style="max-width:640px;margin:0 auto;padding:24px">
  <div style="padding:18px;border-radius:16px;background:#0b1220;color:#fff;font-weight:700">Victor Udoka Anene</div>
  <div style="padding:18px;border:1px solid #e2e8f0;border-radius:16px;margin-top:14px">${inner}</div>
  <div style="margin-top:14px;font-size:12px;color:#64748b">If you didn’t request this, you can ignore this email.</div>
  </div></body></html>`;
}

async function send(to: string, subject: string, html: string) {
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Html: { Data: html } }
        }
      }
    })
  );
}

// DynamoDB single-table behind Amplify Data isn't directly exposed.
// Amplify Data stores in AppSync-managed tables. We’ll process Outbox via GraphQL if desired,
// but for a portable function we accept Outbox table name from env.
// In Amplify Hosting, you can add OUTBOX_TABLE_NAME env var by copying it from `amplify_outputs.json` -> `data` resources.
// To keep this project deployable immediately, we also allow processing via AppSync HTTP endpoint using API key.
// However, this handler uses a lightweight strategy: it scans the generated Dynamo table when OUTBOX_TABLE_NAME is provided.

export const handler = async () => {
  const outboxTable = process.env.OUTBOX_TABLE_NAME;
  if (!outboxTable) {
    console.log("OUTBOX_TABLE_NAME not set. Nothing to process.");
    return { ok: true };
  }

  const pending = await ddb.send(
    new ScanCommand({
      TableName: outboxTable,
      FilterExpression: "#status = :p",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":p": "PENDING" },
      Limit: 25
    })
  );

  const items = pending.Items ?? [];
  for (const item of items) {
    try {
      const payload = JSON.parse(item.payloadJson ?? "{}");
      if (item.type === "NEWSLETTER_CONFIRM") {
        const confirmUrl = `${SITE_URL}/newsletter/confirm?email=${encodeURIComponent(payload.email)}&token=${encodeURIComponent(payload.token)}`;
        await send(
          payload.email,
          "Confirm your subscription",
          htmlWrap(`<h2 style="margin:0 0 8px 0">Confirm subscription</h2>
            <p style="margin:0 0 14px 0">Please confirm to receive weekly product + AWS insights.</p>
            <p><a href="${confirmUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 14px;border-radius:12px;text-decoration:none;font-weight:700">Confirm</a></p>
            <p style="font-size:12px;color:#64748b;margin-top:12px">If the button doesn’t work, copy this link: ${confirmUrl}</p>`)
        );
      } else if (item.type === "CONTACT_CONFIRMATION") {
        await send(
          payload.email,
          "We received your message",
          htmlWrap(`<h2 style="margin:0 0 8px 0">Thanks, ${payload.name}</h2>
            <p style="margin:0">Your message about <b>${payload.inquiryType}</b> was received. I’ll reply with next steps.</p>`)
        );
      }

      await ddb.send(
        new UpdateCommand({
          TableName: outboxTable,
          Key: { id: item.id },
          UpdateExpression: "SET #status = :s",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":s": "SENT" }
        })
      );
    } catch (e: any) {
      console.error("Failed outbox item", item.id, e);
      await ddb.send(
        new UpdateCommand({
          TableName: outboxTable,
          Key: { id: item.id },
          UpdateExpression: "SET #status = :s, #error = :e",
          ExpressionAttributeNames: { "#status": "status", "#error": "error" },
          ExpressionAttributeValues: { ":s": "FAILED", ":e": e?.message ?? "unknown" }
        })
      );
    }
  }

  return { ok: true, processed: items.length };
};

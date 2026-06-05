import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: any) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing request body" }),
    };
  }

  const { contractorName, dropboxFolder, expiresInHours, maxUploads } =
    JSON.parse(event.body);

  const token = randomUUID();
  const expiresAt = new Date(
    Date.now() + expiresInHours * 60 * 60 * 1000,
  ).toISOString();

  await client.send(
    new PutCommand({
      TableName: process.env.UPLOAD_LINK_TABLE,
      Item: {
        id: randomUUID(),
        token,
        contractorName,
        dropboxFolder,
        expiresAt,
        maxUploads,
        uploadCount: 0,
        status: "active",
      },
    }),
  );

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      link: `https://app.dynamomedia.com/upload?token=${token}`,
      token,
      expiresAt,
    }),
  };
};

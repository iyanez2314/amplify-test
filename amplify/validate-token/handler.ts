import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: any) => {
  const token = event.queryStringParameters?.token;

  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing Token" }),
    };
  }

  const result = await client.send(
    new QueryCommand({
      TableName: process.env.UPLOAD_LINK_TABLE,
      IndexName: "byToken",
      KeyConditionExpression: "token = :token",
      ExpressionAttributeValues: { ":token": token },
    }),
  );

  const link = result?.Items?.[0];

  if (!link) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Invalid Token" }),
    };
  }

  if (link.status !== "active") {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Link is no longer active" }),
    };
  }

  if (new Date() > new Date(link.expiresAt)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Link has expired" }),
    };
  }

  if (link.uploadCount >= link.maxUploads) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Upload limit reached" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      contractorName: link.contractorName,
      dropboxFolder: link.dropboxFolder,
    }),
  };
};

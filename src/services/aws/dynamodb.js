import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN
    }
  })
);

export const putSession = (table, item) => {
  return ddb.send(new PutCommand({ TableName: table, Item: item }));
};

export const queryBySessionString = (table, index, sessionString) => {
  return ddb.send(new QueryCommand({
    TableName: table,
    IndexName: index,
    KeyConditionExpression: "sessionString = :v",
    ExpressionAttributeValues: { ":v": sessionString }
  }));
};

export const deactivateSession = (table, id) => {
  return ddb.send(new UpdateCommand({
    TableName: table,
    Key: { id },
    UpdateExpression: "SET active = :v",
    ExpressionAttributeValues: { ":v": false }
  }));
};

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

export const sendEmailNotification = async (topicArn, subject, message) => {
  return sns.send(new PublishCommand({
    TopicArn: topicArn,
    Subject: subject,
    Message: message
  }));
};

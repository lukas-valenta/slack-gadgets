import { WebClient } from '@slack/web-api';
import * as AWS from 'aws-sdk';

const TABLE_NAME = 'MotionEvents';

export const ageInSeconds = (time: number) => {
  return (new Date().getTime() - time) / 1000;
}

export const motion = async (id: string) => {
  const data = {
    'channel': 'CJ89EFT1N',
    'text': `Someone moved in room ${id}!`,
  };

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const lastMovement = await db.query({
      IndexName: 'id-timestamp-index',
      TableName: TABLE_NAME,
      Limit: 1,
      ScanIndexForward: false,
      KeyConditionExpression: 'id = :v1',
      ExpressionAttributeValues: {
        ':v1': {'S': id},
      },
    }).promise();
    if (lastMovement && lastMovement.Items.length && lastMovement.Items[0].timestamp && 
      ageInSeconds(Number(lastMovement.Items[0].timestamp.N)) > 5 * 60) {
      const web = new WebClient(process.env.SLACK_TOKEN);
      await web.chat.postMessage(data);
    }

    await db.put({
      TableName: TABLE_NAME,
      Item: {
        id: {
          S: id,
        },
        timestamp: {
          N: new Date().getTime(),
        },
      },
    }).promise();
  } catch (e) {
    console.log(e);
  }
} 

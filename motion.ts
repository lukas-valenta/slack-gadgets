import { WebClient } from '@slack/web-api';
import * as AWS from 'aws-sdk';
import { inspect } from 'util';
import { ALIAS_TABLE_NAME } from './src/slashes/set-alias';

const TABLE_NAME = 'MotionEvents';

export const ageInSeconds = (time: number) => {
  return (new Date().getTime() - time) / 1000;
}

export const motion = async (id: string) => {
  const web = new WebClient(process.env.SLACK_TOKEN);

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const lastMovement = await db.query({
      TableName: TABLE_NAME,
      Limit: 1,
      ScanIndexForward: false,
      KeyConditionExpression: '#id = :v1',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':v1': id,
      },
    }).promise();
    const gadget = await db.query({
      TableName: ALIAS_TABLE_NAME,
      Limit: 1,
      KeyConditionExpression: '#id = :v1',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':v1': `motion:${id}`,
      },
    }).promise();
    const timeout = (gadget && gadget.Items.length && gadget.Items[0].timeout) ? Number(gadget.Items[0].timeout) : id;
    if (lastMovement && lastMovement.Items.length && lastMovement.Items[0].timestamp && 
      ageInSeconds(Number(lastMovement.Items[0].timestamp)) > timeout) {
      const messageId = (gadget && gadget.Items.length && gadget.Items[0].alias) ? gadget.Items[0].alias : id;
      await web.chat.postMessage({
        'channel': 'CJ89EFT1N',
        'text': `Someone moved in room ${messageId}!`,
      });
    }

    await db.put({
      TableName: TABLE_NAME,
      Item: {
        id,
        timestamp: new Date().getTime(),
      },
    }).promise();
  } catch (e) {
    console.log(e);
    await web.chat.postMessage({
      channel: 'CJ89EFT1N',
      text: `Error: ${inspect(e, false, 2)}`,
    });
  }
} 

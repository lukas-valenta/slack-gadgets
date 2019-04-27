import * as AWS from "aws-sdk";

export const ALIAS_TABLE_NAME = 'GadgetAliases';

export const setMotionTimeout = async (text: string): Promise<string> => {
  const split = text.split(' ');

  if (split.length !== 2) {
    return 'Usage: /set-motion-timeout [id] [timeout in seconds]';
  }

  const [id, timeout] = split;

  if (!id.match(/\d+/)) {
    return 'Id must be a number';
  }
  if (!timeout.match(/\d+/)) {
    return 'Timeout must be a number';
  }

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    await db.update({
      TableName: ALIAS_TABLE_NAME,
      Key: {
        id: `motion:${id}`,
      },
      UpdateExpression: `set #timeout = :v1`,
      ExpressionAttributeNames: {
        "#timeout": 'timeout',
      },
      ExpressionAttributeValues: {
        ':v1': Number(timeout),
      },
    }).promise();
  } catch(e) {
    console.error(e);
    return 'Some error occured :(';
  }

  return 'Okey-dokey';
}

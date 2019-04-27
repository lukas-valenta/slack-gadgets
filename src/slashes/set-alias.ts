import * as AWS from "aws-sdk";

export const ALIAS_TABLE_NAME = 'GadgetAliases';

const types = ['button', 'motion', 'cooper'];
export const setAlias = async (text: string): Promise<string> => {
  const split = text.split(' ');

  if (split.length !== 3) {
    return 'Usage: /set-gadget-alias [type] [id] [alias]';
  }

  const [type, id, alias] = split;

  if (!types.includes(type)) {
    return `Type must be one of: ${types.join(', ')}`;
  }

  if (!id.match(/\d+/)) {
    return 'Id must be a number';
  }

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    await db.update({
      TableName: ALIAS_TABLE_NAME,
      Key: {
        id: `${type}:${id}`,
      },
      UpdateExpression: `set #alias = :v1`,
      ExpressionAttributeNames: {
        "#alias": 'alias',
      },
      ExpressionAttributeValues: {
        ':v1': alias,
      },
    }).promise();
  } catch(e) {
    console.error(e);
    return 'Some error occured :(';
  }

  return 'Okey-dokey';
}

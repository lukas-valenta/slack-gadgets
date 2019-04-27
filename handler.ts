import { APIGatewayProxyHandler } from 'aws-lambda';
import { WebClient } from '@slack/web-api';
import 'source-map-support/register';
import { inspect } from 'util';

export const hello: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const data = {
      'channel': 'CJ89EFT1N',
      'text': 'Hello, World!',
    };
    const web = new WebClient(process.env.SLACK_TOKEN);
    const response = await web.chat.postMessage(data);
      
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
        input: inspect(response, false, 2),
      }, null, 2),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 400,
      body: JSON.stringify({
        e
      }, null, 2),
    }
  };
}

export const data: APIGatewayProxyHandler = async (_event, _context) => {
  return {
    statusCode: 201,
    body: 'Got it!',
  };
}

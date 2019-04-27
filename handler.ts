import { APIGatewayProxyHandler } from 'aws-lambda';
import Axios from 'axios';
import 'source-map-support/register';
import { inspect } from 'util';

export const hello: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const data = {
      'channel': 'CJ89EFT1N',
      'text': 'Hello, World!',
    };
    const response = await Axios.post('https://slack.com/api/chat.postMessage', data, { headers: { 'Authorization': 'Bearer xoxb-610636479856-608835635555-eKGmoL9HY6q3eih1SNMuOqBt' }});
      
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

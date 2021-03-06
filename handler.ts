import { APIGatewayProxyHandler } from 'aws-lambda';
import { WebClient } from '@slack/web-api';
import 'source-map-support/register';
import { inspect } from 'util';
import { motion } from './motion';
import { hardwario } from './cooper';
import { setAlias } from './src/slashes/set-alias';
import * as querystring from 'querystring';
import { setMotionTimeout } from './src/slashes/set-motion-timeout';

export { default as cron } from './src/handlers/cron';
export { default as coffee } from './src/handlers/coffee';

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

export const data: APIGatewayProxyHandler = async (event, _context) => {
  const body = JSON.parse(event.body);
  if (!body || !body.topic || !body.topic.match(/(push-button|motion-detector|recv)/)) {
    return {
      statusCode: 400,
      body: 'Invalid request',
    };
  }


  try {
    switch (true) {
      case /push-button/.test(body.topic):
        // await pushButtonHandler();
        break;
      case /motion-detector.*event-count/.test(body.topic):
        const [,id] = /motion-detector:(\d+)/.exec(body.topic);
        await motion(id);
        break;
      case /recv/.test(body.topic):
        const payload = JSON.parse(body.payload);
        await hardwario(payload);
        break;
      default:
    }

    return {
      statusCode: 201,
      body: 'Got it!',
    };
  } catch (e) {
    return {
      statusCode: 400,
      body: inspect(e, false, 10),
    }
  }
}

export const slash: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const body = querystring.parse(event.body);
    console.log(body);
    if (!body || !body.command || !body.text) {
      return {
        statusCode: 400,
        body: 'Invalid request',
      };
    }
    switch (body.command) {
      case '/set-gadget-alias':
        return {
          statusCode: 200,
          body: await setAlias(<string>body.text),
        }
      case '/set-motion-timeout':
        return {
          statusCode: 200,
          body: await setMotionTimeout(<string>body.text),
        }
    }
  } catch (e) {
  }
}

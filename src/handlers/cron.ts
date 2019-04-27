import { ScheduledHandler } from 'aws-lambda';
import { WebClient } from '@slack/web-api';
import createCoffeeReadyMessage from '../messages/coffee-ready';

const cron: ScheduledHandler = async () => {
  const web = new WebClient(process.env.SLACK_TOKEN);
  try {
    await web.chat.postMessage(createCoffeeReadyMessage('CJ89EFT1N'));
  } catch (e) {
    console.log(e);
  }
};

export default cron;

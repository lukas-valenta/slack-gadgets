import { WebClient } from '@slack/web-api';

export const motion = async (id: string) => {
    const data = {
      'channel': 'CJ89EFT1N',
      'text': `Someone moved in room ${id}!`,
    };
  try {
    const web = new WebClient(process.env.SLACK_TOKEN);
    await web.chat.postMessage(data);
  } catch (e) {
    console.log(e);
  }
} 

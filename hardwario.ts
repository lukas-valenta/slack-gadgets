import { WebClient, ChatPostMessageArguments } from '@slack/web-api';

export const channelId = 'CHWRZT5NX'; // David-hardwario
// 'CJ89EFT1N' - slack gadgets

export const hardwario = async (payload: HardwarioPayload) => {
  const block = composeSlackBlock(payload);
// const block = {
//   "type": "section",
//   "text": {
//     "text": "*Hardwario ID* sends periodic data",
//     "type": "mrkdwn"
//   },
//   "fields": [
//     {
//       "type": "mrkdwn",
//       "text": "*Attribute*"
//     },
//     {
//       "type": "mrkdwn",
//       "text": "*Value*"
//     },
//     {
//       "type": "plain_text",
//       "text": "High"
//     },
//     {
//       "type": "plain_text",
//       "text": "String"
//     }]
//   };

  const data: ChatPostMessageArguments = {
    'channel': channelId,
    'text': `The CO2 levels are ${payload['co2-conc']}!`, // This should not be displayed
     blocks: [block],
     mrkdwn: true
  };

  try {
    const web = new WebClient(process.env.SLACK_TOKEN);
    await web.chat.postMessage(data);
  } catch (e) {
    console.log(e);
  }
}

function composeSlackBlock(payload: HardwarioPayload): any {
  const fields = [
    {
      "type": "mrkdwn",
      "text": "*Attribute*"
    },
    {
      "type": "mrkdwn",
      "text": "*Value*"
    }
  ];

  const relevantValues = [
   'rssi',
   'sequence',
   'altitude',
   'co2-conc',
   'humidity',
   'illuminance',
   'motion-count',
   'orientation',
   'press-count',
   'pressure',
   'sound-level',
   'temperature',
   'voc-conc',
  ];

  relevantValues.forEach((prop) => {
    fields.push({
      type: "plain_text",
      text: prop
    });
    fields.push({
      type: "plain_text",
      text: payload[prop]
    });
  });
}

export interface HardwarioPayload {
  rssi: number;
  id: string;
  sequence: number;
  altitude: number;
  'co2-conc': number;
  humidity: number;
  illuminance: number;
  'motion-count': number;
  orientation: number;
  'press-count': number;
  pressure: number;
  'sound-level': number;
  temperature: number;
  'voc-conc': number;
  voltage: number;
  gw: string;
}

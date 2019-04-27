import { WebClient } from '@slack/web-api';

export const hardwario = async (payload: HardwarioPayload) => {
  const block = composeSlackBlock(payload);
  const data = {
    'channel': 'CJ89EFT1N',
    'text': `The CO2 levels are ${payload['co2-conc']}!`, // This should not be displayed
    message: {
      blocks: [block]
    }
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
      type: prop,
      text: payload[prop]
    });
  });

  const messageBlock = {
    "type": "section",
		"text": {
			"text": `*Hardwario ${payload.id}* sends periodic data`,
			"type": "mrkdwn"
		},
		"fields": fields
  };

  return messageBlock;
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

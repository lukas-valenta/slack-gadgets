import { WebClient, ChatPostMessageArguments } from '@slack/web-api';

// export const channelId = 'CHWRZT5NX'; // David-hardwario
'CJ89EFT1N' - slack gadgets

// BEWARE: Slack has limit of max 10 fields
const co2Limit = 1400;

export const hardwario = async (payload: HardwarioPayload) => {
  let fields = getRelevantFields(payload);
  console.log('fields are', fields);
  const block = {
    "type": "section",
    "text": {
      "text": `*Hardwario ${payload.id}* sends periodic data`,
      "type": "mrkdwn"
    },
    fields: fields
  };

  const blocks = [block];

  if (payload["co2-conc"] > co2Limit) {
    const dangerBlock = getDangerBlock(payload["co2-conc"]);
    blocks.push(<any>dangerBlock);
  }

  const data: ChatPostMessageArguments = {
    'channel': channelId,
    'text': `The CO2 levels are ${payload['co2-conc']}!`, // This should not be displayed
     blocks: blocks,
     mrkdwn: true
  };

  try {
    const web = new WebClient(process.env.SLACK_TOKEN);
    await web.chat.postMessage(data);
  } catch (e) {
    console.log(e);
  }
}

function getRelevantFields(payload: HardwarioPayload): Array<any> {
  let fields = [
    {
      "type": "mrkdwn",
      "text": "*Parameter*"
    },
    {
      "type": "mrkdwn",
      "text": "*Value*"
    }
  ];

  const relevantValues = [
    {
      prop: 'co2-conc',
      desc: 'CO2 concentration',
      units: 'ppm'
    },
    {
      prop: 'humidity',
      desc: 'Humidity',
      units: '%'
    },
    {
      prop: 'temperature',
      desc: 'Temperature',
      units: 'deg C'
    },
    {
      prop: 'voc-conc',
      desc: 'Volatile organic compounds',
      units: 'ppb'
    }
  ];

  relevantValues.forEach((rv) => {
    fields.push({
      type: "plain_text",
      text: rv.desc
    });

    const value = payload[rv.prop] != null ? (payload[rv.prop]).toString() : '-';
    fields.push({
      type: "plain_text",
      text: `${value} ${rv.units}`
    });
  });

  console.log('fields are', fields);

  return fields;
}

function getDangerBlock(co2Value) {
  return {
		"type": "image",
		"title": {
			"type": "plain_text",
			"text": `DANGER! CO2 Level too high. Value is ${co2Value}, but limit is ${co2Limit}`,
			"emoji": true
		},
		"image_url": "https://previews.123rf.com/images/konstantinks/konstantinks1406/konstantinks140600563/29540473-skull-and-bones-danger-triangular-sign-vector-illustration-.jpg",
		"alt_text": "DANGER"
	};
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

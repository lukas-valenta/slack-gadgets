import { WebClient } from '@slack/web-api';

export const hardwario = async (payload: HardwarioPayload) => {
  const data = {
    'channel': 'CJ89EFT1N',
    'text': `The CO2 levels are ${payload['co2-conc']}!`,
  };

  try {
    const web = new WebClient(process.env.SLACK_TOKEN);
    await web.chat.postMessage(data);
  } catch (e) {
    console.log(e);
  }
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

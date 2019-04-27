import { ChatPostMessageArguments } from "@slack/web-api";

const createMessage = (channel: string): ChatPostMessageArguments => ({
  channel,
  text: '',
  attachments: [
    {
      fallback: 'The coffee is ready!',
      color: '#36a64f',
      title: 'Coffee Alarm',
      text: '<!here> The coffee is ready!',
      image_url: 'http://www.shambhalaschool.org/wp-content/uploads/2017/11/pp-hot-coffee-rf-istock.jpg',
      thumb_url: 'http://www.shambhalaschool.org/wp-content/uploads/2017/11/pp-hot-coffee-rf-istock.jpg',
      ts: String((new Date()).getTime()),
    }
  ]
});

export default createMessage;

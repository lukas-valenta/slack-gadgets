import { ScheduledHandler } from 'aws-lambda';

const cron: ScheduledHandler = async () => {
  console.log('do something here each minute');
};

export default cron;

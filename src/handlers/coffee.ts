import { APIGatewayProxyHandler } from "aws-lambda";

const coffeeHandler: APIGatewayProxyHandler = async() => {
  console.log('Store timestamp to DB');
  return {
    statusCode: 200,
    body: 'OK'
  };
};

export default coffeeHandler;

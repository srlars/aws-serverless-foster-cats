import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { createLogger } from "../../utils/logger";

const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();

const CAT_TABLE = process.env.CAT_TABLE;

/**
 * Get all cats (that have been fostered)
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Getting all cats", event);

  try {
    const params = {
      TableName: CAT_TABLE,
    };

    logger.info("Scan all cats");
    const result = await docClient.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result.Items),
    };
  } catch (e) {
    // Return FAIL
    logger.error("Unable to get all cats", { e });
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
      body: e.message,
    };
  }
};

import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { createLogger } from "../../utils/logger";

const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();

const CAT_TABLE = process.env.CAT_TABLE;
const CAT_OWNER_INDEX_NAME = process.env.CAT_OWNER_INDEX_NAME;

/**
 * Get all cats (that have been fostered)
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to get all cats");

  try {
    // Use an INDEX for improved performance
    const params = {
      TableName: CAT_TABLE,
      IndexName: CAT_OWNER_INDEX_NAME,
    };

    logger.info("Querying all cats");
    const result = await docClient.query(params).promise();

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

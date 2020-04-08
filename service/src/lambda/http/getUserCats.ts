import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { getUserIdFromJwt } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();

const CAT_TABLE = process.env.CAT_TABLE;
const CAT_OWNER_INDEX_NAME = process.env.CAT_OWNER_INDEX_NAME;

/**
 * Get all cats (that have been fostered) for a user
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to get all cats for user");

  try {
    logger.info("Getting user id from JWT");
    const ownerId = getUserIdFromJwt(event);

    // Filter for current user and use an INDEX for improved performance
    const params = {
      TableName: CAT_TABLE,
      IndexName: CAT_OWNER_INDEX_NAME,
      KeyConditionExpression: "ownerId = :owner",
      ExpressionAttributeValues: {
        ":owner": ownerId,
      },
    };

    logger.info(`Querying cats for user ${ownerId}`);
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
    logger.error("Unable to create Cat", { e });
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

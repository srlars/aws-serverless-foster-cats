import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { getUserIdFromJwt } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();
const CAT_TABLE = process.env.CAT_TABLE;

/**
 * Get all cats (that have been fostered) for a user
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  logger.info(`Received request to delete cat`);

  try {
    logger.info("Getting user id from JWT");
    const ownerId = getUserIdFromJwt(event);
    const catId = event.pathParameters.catId;

    const params = {
      TableName: CAT_TABLE,
      Key: {
        catId,
        ownerId, // prevents user from deleting someone else's cat
      },
    };

    logger.info(`Deleting cat ${catId} for owner ${ownerId}`);
    const response = await docClient.delete(params).promise();
    logger.info("completed", { response });

    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
      body: null,
    };
  } catch (e) {
    // Return FAIL
    logger.error("Unable to delete Cat", { e });
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
      body: null,
    };
  }
};

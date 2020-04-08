import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { getUserIdFromJwt } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();
const CAT_TABLE = process.env.CAT_TABLE;

/**
 * Updates a CAT
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to update a cat");

  try {
    logger.info("Getting user id from JWT");
    const ownerId = getUserIdFromJwt(event);
    const catId = event.pathParameters.catId;
    const { race, gender, age, name } = JSON.parse(event.body);
    logger.info(
      `Cat id ${catId}.  New details will be race ${race}, gender ${gender}, age ${age}, name ${name}`
    );

    const updateParams = {
      TableName: CAT_TABLE,
      Key: {
        catId,
        ownerId, // prevents user from accessing someone else's cat
      },
      UpdateExpression:
        "set race = :race, gender=:gender, age=:age, name=:name",
      ExpressionAttributeValues: {
        ":race": race,
        ":gender": gender,
        ":age": age,
        ":name": name,
      },
    };

    logger.info("Performing update");
    await docClient.update(updateParams).promise();

    // Return SUCCESS
    logger.info("Updated Cat", { updateParams });
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: null,
    };
  } catch (e) {
    // Return FAIL
    logger.error("Unable to create Cat", { e });
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: e.message,
    };
  }
};

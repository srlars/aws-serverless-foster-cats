import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { v4 as uuid } from "uuid";
import { getUserIdFromJwt } from "../../auth/utils";
import { Cat } from "../../models/Cat";
import { createLogger } from "../../utils/logger";
const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();
const CAT_TABLE = process.env.CAT_TABLE;
const BUCKET_NAME = process.env.CAT_PICTURE_S3_BUCKET;

/**
 * Creates a new CAT
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to create a cat");

  try {
    const { race, gender, age, name } = JSON.parse(event.body);
    const ownerId = getUserIdFromJwt(event);

    const catId = uuid();
    const newCat: Cat = {
      catId,
      ownerId,
      createdAt: new Date().toJSON(),
      race,
      gender,
      age,
      name,
      pictureUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${catId}`,
    };

    const params = {
      TableName: CAT_TABLE,
      Item: newCat,
    };

    logger.info(`will put into ${params.TableName}`);

    await docClient.put(params).promise();

    // Return SUCCESS
    // with the new cat details
    // and a Signed URL for updating the photo
    logger.info("Created Cat", { newCat });
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(newCat),
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

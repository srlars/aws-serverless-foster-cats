import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { S3 } from "aws-sdk";
import "source-map-support/register";
// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from "../../utils/logger";
const logger = createLogger("http");
const headers = {
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Origin": "*",
};
const BUCKET_NAME = process.env.CAT_PICTURE_S3_BUCKET;
const SIGNED_URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION;

/**
 * Get a signed url to edit the photo
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to get signed url");
  try {
    /**
     * Create a Signed URL so that the Picture can be uploaded
     * using the same ID as is used for the Cat
     */
    const s3 = new S3({ signatureVersion: "v4" });
    const imageID = event.pathParameters.catId;
    logger.info(`Creating a signed url for an image with id ${imageID}`);
    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: BUCKET_NAME,
      Key: imageID,
      Expires: parseInt(SIGNED_URL_EXPIRATION, 10),
    });

    logger.info("Created url", { signedUrl });
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ uploadUrl: signedUrl }),
    };
  } catch (e) {
    logger.error("Unable to create a signed url", { e });
    return {
      statusCode: 500,
      headers,
      body: e.message,
    };
  }
};

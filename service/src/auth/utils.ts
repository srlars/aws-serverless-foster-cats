import { decode } from "jsonwebtoken";
import { JwtPayload } from "./JwtPayload";
import { APIGatewayProxyEvent } from "aws-lambda";
import { createLogger } from "../utils/logger";
const logger = createLogger("auth");

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload;
  return decodedJwt.sub;
}

/**
 * Parse event to get JWT from header
 * and then user id from the subject property
 * @param event
 */
export const getUserIdFromJwt = (event: APIGatewayProxyEvent) => {
  const jwtToken = event.headers.Authorization.split(" ")[1];
  const userId = decode(jwtToken).sub;
  logger.info(`user authenticated as ${userId}`);
  return userId;
};

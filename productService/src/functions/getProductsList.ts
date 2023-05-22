import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbService } from "../services/dynamo.service";
import { CORS_HEADERS } from "../models/constants";

export const getProductsList = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("getProductsList", event);
    const results = await DynamoDbService.getProducts();

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify(error),
    };
  }
};

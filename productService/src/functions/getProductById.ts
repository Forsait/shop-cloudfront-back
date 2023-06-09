import { APIGatewayProxyResult } from "aws-lambda";
import { CORS_HEADERS } from "../models/constants";
import { DynamoDbService } from "../services/dynamo.service";

export const getProductById = async (event): Promise<APIGatewayProxyResult> => {
  try {
    console.log("getProductById", event);
    const id = event.pathParameters?.id;
    const product = await DynamoDbService.getProductById(id);

    return {
      statusCode: product ? 200 : 400,
      headers: CORS_HEADERS,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify(error),
    };
  }
};

import { APIGatewayProxyResult } from "aws-lambda";
import { CORS_HEADERS } from "../models/constants";
import { DynamoDbService } from "../services/dynamo.service";

export const createProduct = async (event): Promise<APIGatewayProxyResult> => {
  try {
    console.log("createProduct", event);
    const product = event.queryStringParameters;
    const resProduct = await DynamoDbService.createProduct(product);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(resProduct),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify(error),
    };
  }
};

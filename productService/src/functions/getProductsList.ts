import { APIGatewayProxyResult } from "aws-lambda";
import { StoreService } from "../store/store.service";

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(StoreService.getAllProductsList()),
  };
};

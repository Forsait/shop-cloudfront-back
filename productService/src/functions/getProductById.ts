import { APIGatewayProxyResult } from "aws-lambda";

import { StoreService } from "../store/store.service";
import { Product } from "../interfaces/product.interface";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const getProductById = async (event): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  const products = StoreService.getAllProductsList();
  const product = products.find((item: Product) => {
    return item.id === id;
  });

  if (!product) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: `Product with id (${id}) not found!`,
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(product),
  };
};

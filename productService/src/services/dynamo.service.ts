import { DynamoDB } from "aws-sdk";

import { Product } from "../interfaces/product.interface";

const dynamo = new DynamoDB.DocumentClient();

export class DynamoDbService {
  static async getProducts(): Promise<Product[]> {
    const productsResults = await dynamo
      .scan({
        TableName: "productsTable",
      })
      .promise();

    const stockResults = await dynamo
      .scan({
        TableName: "stockTable",
      })
      .promise();

    const results = productsResults.Items?.map((product: Product) => {
      const stock = stockResults.Items?.find(
        (stock) => stock.product_id === product.id
      );

      return { ...product, count: stock?.count ?? 0 } as Product;
    });

    return results || [];
  }

  static async getProductById(id: string): Promise<Product | null> {
    const productResults = await dynamo
      .query({
        TableName: "productsTable",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
      })
      .promise();

    if (!productResults.Items?.length) {
      return null;
    }

    const product = productResults?.Items[0] as Product;

    const stockResults = await dynamo
      .query({
        TableName: "stockTable",
        KeyConditionExpression: "product_id = :product_id",
        ExpressionAttributeValues: { ":product_id": product.id },
      })
      .promise();

    const stock = stockResults?.Items?.length
      ? stockResults.Items[0]
      : { count: 0 };

    return { ...product, count: stock.count };
  }

  static async createProduct(product: Product): Promise<Product> {
    const productWithId = { ...product, id: Date.now().toString(10) };

    await dynamo
      .put({
        TableName: "productsTable",
        Item: productWithId,
      })
      .promise();
    return product;
  }
}

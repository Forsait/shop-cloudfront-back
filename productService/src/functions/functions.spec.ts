import { jest, test } from "@jest/globals";

import { StoreService } from "../store/store.service";
import { getProductsList } from "./getProductsList";
import { getProductById } from "./getProductById";

const mockData = [
  {
    id: "1",
    title: "Programming Pearls, 2nd edition",
    author: "Jon Bentley",
    price: 5,
    count: 10,
    description: "The best book ever!",
  },
  {
    id: "2",
    title: "Clean Code Series by Robert Martin",
    author: "Robert C. Martin",
    price: 5,
    count: 10,
    description: "The best book ever!",
  },
];

beforeAll(() => {
  jest.spyOn(StoreService, "getAllProductsList").mockReturnValueOnce(mockData);
});

describe("getProductsList", () => {
  test("should return mock data", async () => {
    const actualValue = await getProductsList();
    expect(actualValue.body).toEqual(JSON.stringify(mockData));
    expect(actualValue.statusCode).toEqual(200);
  });
});

describe("getProductById", () => {
  test("should return product with definite id", async () => {
    const productItem = mockData[0];
    const eventData = { pathParameters: { id: productItem.id } };
    const actualValue = await getProductById(eventData);
    expect(actualValue.body).toEqual(JSON.stringify(productItem));
    expect(actualValue.statusCode).toEqual(200);
  });

  test("should return error with nonexistent id", async () => {
    const eventData = { pathParameters: { id: undefined } };
    const actualValue = await getProductById(eventData);
    expect(actualValue.statusCode).toEqual(404);
  });
});

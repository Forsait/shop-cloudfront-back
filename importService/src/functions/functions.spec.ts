import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

import { getSignedUrl } from "./getSignedUrl";

describe("getSignedUrl", () => {
  const signedURL = "https://signedUrl";
  let event;

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("S3", "getSignedUrl", signedURL);
    event = {
      queryStringParameters: {
        name: "test.csv",
      },
    };
  });

  //   test("should return signed url", async () => {
  //     const actualValue = await getSignedUrl(event);
  //     expect(actualValue.body).toEqual(JSON.stringify({ signedURL }));
  //     expect(actualValue.statusCode).toEqual(200);
  //   });

  test("should return error cause filename is not specified", async () => {
    event.queryStringParameters.name = undefined;
    const actualValue = await getSignedUrl(event);
    expect(actualValue.statusCode).toEqual(500);
  });
});

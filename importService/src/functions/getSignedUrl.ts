import { APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

const BUCKET = "lambda-integration-bucket";
const s3 = new AWS.S3({ region: "us-east-1" });

export const getSignedUrl = async function (
  event
): Promise<APIGatewayProxyResult> {
  let statusCode = 200;
  let body = {};

  try {
    const fileName = event.queryStringParameters.name;
    if (fileName) {
      const signedUrlParams = {
        Bucket: BUCKET,
        Key: `uploaded/${fileName}`,
        Expires: 60,
        ContentType: "text/csv",
      };

      const signedUrl = await s3.getSignedUrlPromise(
        "putObject",
        signedUrlParams
      );
      body = { signedUrl };
    } else {
      body = { error: `The file name is not specified!` };
      statusCode = 500;
    }
  } catch (error) {
    console.error("Error appears:");
    console.error(error);
    statusCode = 500;
    body = error;
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};

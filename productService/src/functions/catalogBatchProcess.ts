import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
// import { DynamoDbService } from '../services/dynamo.service';

const sns = new SNS({ region: 'us-east-1' });

export const catalogBatchProcess = async (event: SQSEvent): Promise<string> => {
  try {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    for (const { messageId, body } of event.Records) {
      console.log('SQS message %s: %j', messageId, body);
      // await DynamoDbService.createProduct(JSON.parse(body));
    }
    const products = event.Records.map(({ body }) => body);
    await publishToSnsTopic(products);
  } catch (error) {
    console.error(error);
  }

  return `Successfully processed ${event.Records.length} messages.`;
};

function publishToSnsTopic(products) {
  return new Promise((resolve, reject) => {
    sns.publish(
      {
        Subject: 'Product created',
        Message: JSON.stringify(products, null, 2),
        TopicArn: process.env.SNS_ARN,
      },
      (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }
    );
  });
}

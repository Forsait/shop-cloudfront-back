import { AWSError, S3, SQS } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

const s3 = new S3({ region: 'us-east-1' });
const sqs = new SQS({ region: 'us-east-1' });

export const onCsvFileUploaded = async function (
  event: S3Event
): Promise<void> {
  console.log('event', JSON.stringify(event));

  try {
    for (let record of event.Records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = record.s3.object.key;
      const params = {
        Bucket: bucketName,
        Key: objectKey,
      };

      const queueUrl: SQS.GetQueueUrlResult = await new Promise(
        (resolve, reject) => {
          sqs.getQueueUrl(
            { QueueName: process.env.SQS_NAME },
            function (err: AWSError, data: SQS.GetQueueUrlResult) {
              if (err) reject(err); // an error occurred
              else resolve(data); // successful response
            }
          );
        }
      );

      const s3Stream = s3.getObject(params).createReadStream();

      await new Promise((resolve, reject) => {
        s3Stream
          .pipe(csv())
          .on('data', (data) => sendMessageToSQS(queueUrl.QueueUrl, data))
          .on('end', async () => {
            console.log('END', objectKey);
            resolve('');
          })
          .on('error', (error) => {
            console.error(error);
            reject(error);
          });
      });

      await replaceObject(bucketName, objectKey);
    }
  } catch (error) {
    console.error('Error appears:');
    console.error(error);
  }
};

function sendMessageToSQS(queueUrl, data: object): void {
  sqs.sendMessage(
    {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(data),
    },
    (error: AWSError, res: SQS.SendMessageResult) => {
      if (error) {
        console.error(error);
      } else {
        console.log(res);
      }
    }
  );
}

async function replaceObject(bucketName, objectKey): Promise<void> {
  try {
    const parsedObjectKey = objectKey.replace('uploaded', 'parsed');

    await s3
      .copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${objectKey}`,
        Key: parsedObjectKey,
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: objectKey,
      })
      .promise();
  } catch (error) {
    console.error('Error appears on copy:');
    console.error(error);
  }
}

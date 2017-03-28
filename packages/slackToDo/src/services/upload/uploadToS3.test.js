const { expect, afterEach } = window;

import S3Client from './index';

const AWS_REGION = 'us-east-1';
const AWS_ACCESS_KEY_ID = 'AKIAI23DE4QDWZ3GYR4A';
const AWS_SECRET_ACCESS_KEY = '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';

let s3Client = null;

afterEach(() => {
  s3Client = new S3Client({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });
});

test('should create s3 client', () => {
  expect(s3Client).toBeDefined();
});

test('should list buckets', async () => {
  const response = await s3Client.listBuckets();

  expect(response).toBeDefined();

  expect(Object.keys(response)).toContain('Buckets');
});

test('should create bucket', async () => {
  const response = await s3Client.createBucket('MakeenBucket');

  expect(response).toBeDefined();

  expect(Object.keys(response)).toContain('Location');

  expect(response.Location).toEqual('/MakeenBucket');
});

test('should delete bucket', async () => {
  const deleteResponse = await s3Client.deleteBucket('MakeenBucket');

  expect(deleteResponse).toBeDefined();

  expect(Object.keys(deleteResponse).length).toBe(0);

  const listReponse = await s3Client.listBuckets();

  expect(listReponse.Buckets.length).toBe(0);
});

test('should upload file to s3 bucket', async () => {
  await s3Client.createBucket('MakeenBucket');

  const result = await s3Client.uploadFile({
    bucketName: 'MakeenBucket',
    file: 'Save the planet',
    contentType: 'txt',
  });

  expect(result).toBeDefined();
});

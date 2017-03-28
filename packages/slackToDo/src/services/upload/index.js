import S3 from 'aws-sdk/clients/s3';
import Joi from 'joi';
import Promise from 'bluebird';
import uuid from 'node-uuid';

const s3OptionsSchema = {
  accessKeyId: Joi.string().required(),
  secretAccessKey: Joi.string().required(),
  apiVersion: Joi.string(),
  region: Joi.string(),
};

export default class S3Client {
  s3 = null;

  constructor(s3Options) {
    Joi.attempt(s3Options, s3OptionsSchema);

    this.s3 = new S3(s3Options);
  }

  async listBuckets() {
    const listBuckets = Promise.promisify(this.s3.listBuckets, this.s3);

    return listBuckets();
  }

  async createBucket(bucketName) {
    const createBucket = Promise.promisify(this.s3.createBucket, this.s3);

    return createBucket({
      Bucket: bucketName,
    });
  }

  async deleteBucket(bucketName) {
    const deleteBucket = Promise.promisify(this.s3.deleteBucket, this.s3);

    return deleteBucket({
      Bucket: bucketName,
    });
  }

  async uploadFile({ bucketName, file, contentType }) {
    const upload = Promise.promisify(this.s3.upload, this.s3);

    return upload({
      Bucket: bucketName,
      Key: `${uuid.v4()}.${contentType}`,
      ContentType: contentType,
      Body: file,
      ACL: 'bucket-owner-full-control',
    });
  }
}

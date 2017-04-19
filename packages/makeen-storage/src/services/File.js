import Joi from 'joi';
import { decorators } from 'octobus.js';
import ServiceContainer from 'makeen-core/build/octobus/ServiceContainer';
import path from 'path';
import fs from 'fs-promise';

const { service, withSchema } = decorators;

class File extends ServiceContainer {
  constructor({ uploadDir }) {
    super();
    this.uploadDir = uploadDir;
  }

  setServiceBus(...args) {
    super.setServiceBus(...args);
    this.FileRepository = this.extract('FileRepository');
  }

  @service()
  @withSchema({
    accountId: Joi.object().required(),
    userId: Joi.object().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    bytes: Joi.number().required(),
    headers: Joi.object().required(),
    getPath: Joi.func().allow(null),
  })
  async createFromUpload(
    {
      accountId,
      userId,
      path: uploadPath,
      filename,
      bytes,
      headers,
      getPath,
    },
  ) {
    const file = await this.FileRepository.createOne({
      accountId,
      userId,
      filename: path.basename(filename),
      extension: path.extname(filename),
      size: bytes,
      contentType: headers['content-type'],
      uploadedAt: new Date(),
    });

    const destination = getPath ? getPath(file) : await this.getPath(file);

    await fs.rename(uploadPath, destination);

    return file;
  }

  @service()
  getPath(file) {
    return path.join(this.uploadDir, `${file._id}${file.extension}`);
  }
}

export default File;

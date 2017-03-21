import Boom from 'boom';
import Router from 'makeen-core/src/routers/Router';
import Joi from 'joi';
import { idValidator } from 'makeen-core/src/libs/mongo-helpers';
import { route } from 'makeen-core/src/octobus/decorators';
import { ObjectID as objectId } from 'mongodb';
import Hawk from 'hawk';

class FileRouter extends Router {
  constructor({
    File, FileRepository, bewitCredentials,
  }, config = {}) {
    super({
      namespace: 'File',
      basePath: '/files',
      ...config,
    });

    this.File = File;
    this.FileRepository = FileRepository;
    this.bewitCredentials = bewitCredentials;
  }

  async findFile(request) {
    const file = await this.FileRepository.findOne({
      query: { _id: objectId(request.params.fileId) },
    });

    if (!file) {
      throw Boom.notFound('File not found!');
    }

    return file;
  }

  @route.post({
    path: '/upload',
    config: {
      pre: [{
        method(request, reply) {
          reply(request.payload.file);
        },
        assign: 'uploadedFile',
      }],
      payload: {
        output: 'file',
        parse: true,
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
        },
      },
      validate: {
        payload: {
          file: Joi.any().required().meta({ swaggerType: 'file' }).description('file'),
        },
      },
      description: 'Upload a file',
    },
  })
  async upload(request) {
    const { uploadedFile } = request.pre;
    const userId = objectId(request.auth.credentials.id);
    const accountId = objectId(request.auth.credentials.accountId);

    return this.File.createFromUpload({
      ...uploadedFile,
      accountId,
      userId,
    });
  }

  @route.get({
    path: '/{fileId}/download',
    config: {
      auth: 'bewit',
      validate: {
        params: {
          fileId: idValidator,
        },
      },
      description: 'Download a file',
    },
  })
  async download(request, reply) {
    const file = await this.findFile(request);
    const filePath = await this.File.getPath(file);

    reply.file(filePath, {
      confine: false,
      filename: file.filename,
      mode: 'attachment',
    });
  }

  @route.delete({
    path: '/{fileId}',
    config: {
      validate: {
        params: {
          fileId: idValidator,
        },
      },
      description: 'Delete a file',
    },
  })
  async removeFile(request) {
    const file = await this.findFile(request);
    return this.FileRepository.deleteOne({ query: { _id: file._id } });
  }

  @route.post({
    path: '/sign-url',
    config: {
      validate: {
        payload: {
          url: Joi.string().uri().required(),
        },
      },
      description: 'Sign a file download',
    },
  })
  signUrl(request) {
    const { url } = request.payload;
    const { bewitCredentials } = this;
    const id = request.auth.credentials.accountId;

    const bewit = Hawk.client.getBewit(url, {
      credentials: {
        ...bewitCredentials,
        id,
      },
      ttlSec: 60,
    });

    return {
      url: `${url}?bewit=${bewit}`,
    };
  }
}

export default FileRouter;

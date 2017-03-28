import { CRUDServiceContainer } from 'octobus-crud';
import { decorators } from 'octobus.js';
import fs from 'fs-promise';
import { ObjectID as objectId } from 'mongodb';
import fileSchema from '../schemas/file';

const { service } = decorators;

class FileRepository extends CRUDServiceContainer {
  constructor({ store }) {
    super(store, fileSchema);
  }

  setServiceBus(serviceBus) {
    super.setServiceBus(serviceBus);
    this.File = serviceBus.extract('File');
  }

  @service()
  async deleteMany(params) {
    const { query } = params;
    const files = await this.findMany({
      query,
      fields: ['workspaceId', 'extension'],
    }).then((c) => c.toArray());

    const result = await CRUDServiceContainer.prototype.deleteMany.call(this, params);

    if (Array.isArray(files) && files.length) {
      await Promise.all(
        files.map(
          (file) => this.File.getPath(file).then((path) => fs.unlink(path)),
        ),
      );
    }

    return result;
  }

  @service()
  async deleteOne(params) {
    let file;

    if (params instanceof objectId) {
      file = await this.findById(params);
    } else {
      file = await this.findOne({ query: params.query });
    }

    const result = await CRUDServiceContainer.prototype.deleteOne.call(this, params);

    if (file) {
      await fs.unlink(await this.File.getPath(file));
    }

    return result;
  }
}

export default FileRepository;

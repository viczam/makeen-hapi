import { decorators } from 'octobus.js';

const { withHandler } = decorators;

const handler = ({ _id, username, accountId, roles }) =>
  ({ id: _id, username, accountId, scope: roles });

export default withHandler(handler);

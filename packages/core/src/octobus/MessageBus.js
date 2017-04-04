import { MessageBus } from 'octobus.js';
import TransportRouter from 'octobus.js/dist/routing/TransportRouter';
import RealTimeTransport from 'octobus.js/dist/transports/RealTime';

export default class extends MessageBus {
  constructor() {
    const router = new TransportRouter([{
      matcher: /.*/,
      transport: new RealTimeTransport(),
    }]);
    super(router);
  }
}

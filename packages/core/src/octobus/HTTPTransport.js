import BaseTransport from 'octobus.js/dist/transports/Base';
import axios from 'axios';

class HTTPTransport extends BaseTransport {
  constructor(rpcEndpoint) {
    super();

    this.on('message.sent', async (message) => {
      const reply = {};

      try {
        reply.result = (await axios.post(`${rpcEndpoint}/${message.topic}`, message.data)).data;
      } catch (error) {
        reply.error = error;
      }

      this.emit('reply.received', Object.assign(message, reply));
    });
  }
}

export default HTTPTransport;

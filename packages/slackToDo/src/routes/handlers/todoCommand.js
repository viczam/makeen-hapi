import Boom from 'boom';
import requestLib from 'request';

export default async function (request, reply) {
  try {
    const { text, team_id, user_id, response_url } = request.payload;
    const { dispatch } = this;

    reply();

    const commands = await dispatch('commands.extract', text);
    const commandsResults = await dispatch('commands.execute', {
      commands,
      slackTeamId: team_id,
      userId: user_id,
    });

    requestLib({
      method: 'POST',
      uri: response_url,
      json: true,
      body: { text: commandsResults },
    }, (err) => {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    reply(Boom.wrap(err));
  }
};


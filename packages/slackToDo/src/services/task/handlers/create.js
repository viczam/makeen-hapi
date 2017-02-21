import shortid from 'shortid32';

export default async ({ params, lookup }) => {
  const SlackToDoTask = lookup('entity.SlackToDoTask');
  const { name, slackTeamId } = params;

  if (!name || !slackTeamId) {
    throw new Error('Invalid task name or teamId provided');
  }
  return await SlackToDoTask.createOne({
    friendlyId: shortid.generate(),
    slackTeamId,
    name,
  });
};

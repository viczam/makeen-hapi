export default async ({ params, lookup }) => {
  const SlackToDoTask = lookup('entity.SlackToDoTask');
  const { taskId, slackTeamId } = params;

  if (!taskId || !slackTeamId) {
    throw new Error('Invalid taskid or teamId provided');
  }

  return await SlackToDoTask.deleteOne({
    query: {
      friendlyId: taskId,
      slackTeamId,
    },
  });
};

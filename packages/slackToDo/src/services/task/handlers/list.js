export default async ({ params, lookup }) => {
  const SlackToDoTask = lookup('entity.SlackToDoTask');
  const { slackTeamId } = params;

  if (!slackTeamId) {
    throw new Error('Invalid task name or teamId provided');
  }
  return await SlackToDoTask.findMany({
    query: {
      slackTeamId,
    },
  }).then((r) => r.toArray());
};


export default async ({ params, lookup }) => {
  const SlackToDoTask = lookup('entity.SlackToDoTask');
  const { taskId, slackTeamId, assignedTo } = params;

  if (!taskId || !slackTeamId) {
    throw new Error('Invalid taskid or teamId provided');
  }

  await SlackToDoTask.updateOne({
    query: {
      friendlyId: taskId,
      slackTeamId,
    },
    update: {
      $set: {
        assignedTo,
      },
    },
  });

  return await SlackToDoTask.findOne({
    query: {
      friendlyId: taskId,
      slackTeamId,
    },
  });
};

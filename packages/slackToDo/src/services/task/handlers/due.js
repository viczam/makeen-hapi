export default async ({ params, lookup }) => {
  const SlackToDoTask = lookup('entity.SlackToDoTask');
  const { taskId, slackTeamId, dueDate } = params;

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
        dueDate,
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

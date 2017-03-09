export default async ({ params, lookup }) => {
  const SlackToDoTask = lookup('entity.SlackToDoTask');
  const { taskId, slackTeamId } = params;

  if (!taskId || !slackTeamId) {
    throw new Error('Invalid taskid or teamId provided');
  }

  const task = await SlackToDoTask.findOne({
    query: {
      friendlyId: taskId,
      slackTeamId,
    },
  });

  if (!task) {
    return null;
  }

  await SlackToDoTask.updateOne({
    query: {
      friendlyId: taskId,
      slackTeamId,
    },
    update: {
      $set: {
        isCompleted: !task.isCompleted,
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

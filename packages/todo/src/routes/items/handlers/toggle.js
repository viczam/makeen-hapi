import Boom from 'boom';

export default async function (request, reply) {
  const { TodoItemEntity } = this;
  const { item } = request.pre;

  try {
    const isChecked = !item.isChecked;

    await TodoItemEntity.updateOne({
      query: {
        _id: item._id,
      },
      update: {
        $set: { isChecked },
      },
    });

    reply({
      ...item,
      isChecked,
    });
  } catch (err) {
    reply(Boom.wrap(err));
  }
};

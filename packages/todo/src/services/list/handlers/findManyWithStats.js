import { decorators, applyDecorators } from 'octobus.js';

const { withLookups, withHandler } = decorators;

export default applyDecorators([
  withLookups({
    TodoItemEntity: 'entity.TodoItem',
    TodoListEntity: 'entity.TodoList',
  }),
  withHandler,
], async ({ params, TodoItemEntity, TodoListEntity }) => {
  const lists = await TodoListEntity.findMany(params).then((c) => c.toArray());
  const listIds = lists.map(({ _id }) => _id);

  const [
    items,
    checkedItemsPerList,
  ] = await Promise.all([
    TodoItemEntity.findMany({
      query: {
        listId: {
          $in: listIds,
        },
        isChecked: false,
      },
    }).then((c) => c.toArray()),
    TodoItemEntity.aggregate({
      pipeline: [{
        $match: {
          listId: {
            $in: listIds,
          },
          isChecked: true,
        },
      }, {
        $group: {
          _id: '$listId',
          count: {
            $sum: 1,
          },
        },
      }],
    }).then((c) => c.toArray()),
  ]);

  return {
    lists,
    items,
    checkedItemsPerList,
  };
});

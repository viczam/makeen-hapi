import { decorators, applyDecorators } from 'octobus.js';

const { withLookups, withHandler } = decorators;

export default applyDecorators([
  withLookups({
    TodoItemEntity: 'entity.TodoItem',
    TodoListEntity: 'entity.TodoList',
  }),
  withHandler,
], async ({ params, next, TodoItemEntity, TodoListEntity }) => {
  const { query } = params;
  const list = await TodoListEntity.findOne({ query });
  const result = await next(params);

  await Promise.all([
    TodoItemEntity.deleteMany({
      query: {
        listId: list._id,
      },
    }),
  ]);

  return result;
});

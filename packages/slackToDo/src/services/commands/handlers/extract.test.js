import extractActions from './extract';

const { expect } = window;

test('extract correct multiple actions from text', () => {
  const actions = extractActions({
    params: 'task create some text goes here assign to @danmo due February 1',
  });

  expect(actions.length).toBe(3);
  expect(actions[0].action).toBe('create');
  expect(actions[1].action).toBe('assign');
  expect(actions[2].action).toBe('due');
});

test('extract correct multiple actions from text', () => {
  const actions = extractActions({
    params: 'task due February 1 create some text goes here assign to @danmo',
  });

  expect(actions.length).toBe(3);
  expect(actions[0].action).toBe('due');
  expect(actions[1].action).toBe('create');
  expect(actions[2].action).toBe('assign');
});

test('extract correct single action from text', () => {
  const actions = extractActions({
    params: 'task create some text',
  });

  expect(actions.length).toBe(1);
  expect(actions[0].action).toBe('create');
});

test('extract correct single action from text', () => {
  const actions = extractActions({
    params: 'task assign TXXX to @danmo',
  });

  expect(actions.length).toBe(1);
  expect(actions[0].action).toBe('assign');
});

test('extract correct single action from text', () => {
  const actions = extractActions({
    params: 'task due Tommorow',
  });

  expect(actions.length).toBe(1);
  expect(actions[0].action).toBe('due');
});

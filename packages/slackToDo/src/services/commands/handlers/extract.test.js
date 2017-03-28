import extractcommands from './extract';

const { expect } = window;

test('extract correct multiple commands from text', () => {
  const commands = extractcommands({
    params: 'task create some text goes here assign to @danmo due February 1',
  });

  expect(commands.length).toBe(3);
  expect(commands[0].command).toBe('create');
  expect(commands[1].command).toBe('assign');
  expect(commands[2].command).toBe('due');
});

test('extract correct multiple commands from text', () => {
  const commands = extractcommands({
    params: 'task due February 1 create some text goes here assign to @danmo',
  });

  expect(commands.length).toBe(3);
  expect(commands[0].command).toBe('due');
  expect(commands[1].command).toBe('create');
  expect(commands[2].command).toBe('assign');
});

test('extract correct single command from text', () => {
  const commands = extractcommands({
    params: 'task create some text',
  });

  expect(commands.length).toBe(1);
  expect(commands[0].command).toBe('create');
});

test('extract correct single command from text', () => {
  const commands = extractcommands({
    params: 'task assign TXXX to @danmo',
  });

  expect(commands.length).toBe(1);
  expect(commands[0].command).toBe('assign');
});

test('extract correct single command from text', () => {
  const commands = extractcommands({
    params: 'task due Tommorow',
  });

  expect(commands.length).toBe(1);
  expect(commands[0].command).toBe('due');
});

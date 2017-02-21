import { extractAll } from './assets';

export default ({ params }) => {
  const commandTypes = ['create', 'remove', 'check', 'uncheck', 'assign', 'due', 'list', 'help'];

  const text = params;
  const positions = commandTypes
    .filter((command) => text.search(new RegExp(command, 'i')) > -1)
    .map((command) => text.search(new RegExp(command, 'i')))
    .sort((a, b) => a > b);

  const extractedCommands = [];

  for (let pos = 0; pos < positions.length; pos += 1) {
    extractedCommands.push(text.slice(positions[pos], positions[pos + 1] || text.length));
  }

  return extractedCommands.map((commandText) => {
    const command = commandTypes.find((commandName) => commandText.search(new RegExp(`(${commandName})`, 'i')) > -1);
    const assets = commandText.replace(new RegExp(`(${command})`, 'gi'), '').trim();

    return {
      command,
      assets: extractAll(assets),
    };
  });
};

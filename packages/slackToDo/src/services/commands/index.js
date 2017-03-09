import extractCommands from './handlers/extract';
import executeCommands from './handlers/execute';

export default ({
  dispatcher: { subscribe },
}) => {
  subscribe('commands.extract', extractCommands);
  subscribe('commands.execute', executeCommands);
};

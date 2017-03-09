import chrono from 'chrono-node';

export const extractUserAssets = (text) => {
  const re = /(?:^|\W)@(\w+)(?!\w)/g;
  let match;
  const matches = [];

  match = re.exec(text);
  while (match) {
    matches.push(match[1]);
    match = re.exec(text);
  }

  return matches.length ? matches[0] : null;
};

export const extractTicketAssets = (text) => {
  const re = /(?:^|\W)TK(\w+)(?!\w)/g;
  let match;
  const matches = [];

  match = re.exec(text);
  while (match) {
    matches.push(match[1]);
    match = re.exec(text);
  }

  return matches.length ? matches[0] : null;
};

export const extractDateAssets = (text) => chrono.parseDate(text);

export const extractTextAssets = (text) => text;

export const extractAll = (text) => ({
  assignedTo: extractUserAssets(text),
  taskId: extractTicketAssets(text),
  dueDate: extractDateAssets(text),
  name: extractTextAssets(text),
});

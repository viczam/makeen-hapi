import docdown from 'docdown';
import documentation from 'documentation';
import publisher from 'esdoc/out/src/Publisher/publish';

import ESDoc from 'esdoc/out/src/ESDoc';

import fs from 'fs';

const filesToDocument = fs
  .readdirSync(`${__dirname}/../packages/makeen-router/src/routers/`)
  .map(file => `${__dirname}/../packages/makeen-router/src/routers/${file}`);

if (!fs.existsSync(`${__dirname}/generated`)) {
  fs.mkdirSync(`${__dirname}/generated`);
}

// docdown docs
const markdown = filesToDocument.map(file =>
  docdown({
    path: file,
    url: 'https://github.com/makeen-project/makeen',
    toc: 'categories',
  }),
);

fs.writeFileSync(
  `${__dirname}/generated/MongoResourceRouter(docdown).md`,
  markdown,
);

// documentation docs
documentation
  .build(filesToDocument, {})
  .then(data =>
    documentation.formats.md(data, {
      theme: 'default_theme',
    }),
  )
  .then(output => {
    fs.writeFileSync(
      `${__dirname}/generated/MongoResourceRouter(documentation).md`,
      output,
    );
  });

// ESDoc
ESDoc.generate(
  {
    source: `${__dirname}/../packages/makeen-router/src/routers/`,
    destination: `${__dirname}/generated/esdoc/`,
    experimentalProposal: {
      classProperties: true,
      objectRestSpread: true,
      decorators: true,
    },
  },
  publisher,
);

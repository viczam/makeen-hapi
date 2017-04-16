Makeen Core
==============

As the name states this plugin is the core of all other Makeen plugins by providing shared functionality such as:
- `createServer` logic for creating a [Hapi.js](https://hapijs.com) server and loading it's plugins (exported as a node module member function)
- `createServiceBus` logic for creating a [Octobus.js](https://github.com/makeen-project/octobus) service bus required by service containers (exposed as a server method)
- `createStorage` logic for creating [octobus mongodb storage](https://github.com/makeen-project/octobus-mongodb) required by service containers(exposed as a server method)


#### Requirements
- Node v6 or higher

#### Installation
`npm install makeen-core`

Makeen Core
==============

As the name states this plugin is the core of all other Makeen plugins by providing shared functionality such as:
- `createServer` logic for creating a [Hapi.js](https://hapijs.com) server and loading its plugins (exported as a node module member function)
- `createServiceBus` logic for creating a [Octobus.js](https://github.com/makeen-project/octobus) service bus required by service containers (exposed as a server method)
- `createStore` logic for creating [octobus mongodb storage](https://github.com/makeen-project/octobus-mongodb) required by service containers(exposed as a server method)


Under the hood Makeen Core uses [hapi-octobus](https://github.com/makeen-project/hapi-octobus), a Hapi.js adapter plugin for [Octobus.js](https://github.com/makeen-project/octobus).

The following [Octobus.js](https://github.com/makeen-project/octobus) constructs are being extensively used:
- MessageBus
- ServiceBus

[Octobus.js](https://github.com/makeen-project/octobus) promotes a modular message driven architecture where
you develop services called `SeviceContainers` which encapsulate cohesive logic and allow inter-service communication by way of messages.

A `ServiceBus` is concerned with creating, managing and invoking published services. Each service will require a `MessageBus` which is a lower layer concerned with message transportation, by default this uses the node [EventEmitter](https://nodejs.org/api/events.html) class but can be configured to rely on HTTP transport such that you can enable cross-process communication between services running on different processes/locations.

#### Requirements
- Node v6 or higher

#### Installation
`npm install makeen-core`

Because Makeen is a collection of plugins you will need a [Hapi.js](https://hapijs.com/) server to load and run them. To speed things up Makeen is providing the server component in the shape of a [boilerplate](https://github.com/makeen-project/boilerplate) which you can clone and install.

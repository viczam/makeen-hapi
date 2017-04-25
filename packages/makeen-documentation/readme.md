Makeen Documentation
====================

Makeen plugin that documents and showcases all exposed REST endpoints.

Under the hood it uses [hapi-swagger](https://github.com/glennjones/hapi-swagger) and comes preconfigured with security schemes which describe how secured requests should be done and json editor in the UI.

Once launched documentation will be available at http://localhost:3001/documentation

![](assets/makeen_doc.png?raw=true)

#### Requirements
- Node v6 or higher

#### Installation
`npm install makeen-documentation`


Because Makeen is a collection of plugins you will need a [Hapi.js](https://hapijs.com/) server to load and run them. To speed things up Makeen is providing the server component in the shape of a [boilerplate](https://github.com/makeen-project/boilerplate) which you can clone and install.
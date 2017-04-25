Makeen Monitoring
=================

Makeen plugin that provides insight into the backend performance and activity.

Under the hood it uses [hapijs-status-monitor](https://github.com/ziyasal/hapijs-status-monitor)

Real time usage indicators:
  - CPU
  - Memory
  - Load Avg
  - Response Time
  - Requests per Second
  - Status Codes

![](assets/makeen_monitoring.png?raw=true)

## Requirements
- Node v6 or higher

## Installation
`npm install makeen-monitoring`



Because Makeen is a collection of plugins you will need a [Hapi.js](https://hapijs.com/) server to load and run them. To speed things up Makeen is providing the server component in the shape of a [boilerplate](https://github.com/makeen-project/boilerplate) which you can clone and install.
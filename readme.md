- swagger documentation - http://localhost:3003/documentation

Environment variables that override default mongodb uri 127.0.0.1:
----------------
MAKEEN_ENV_SERVER_CACHE_URI=mongodb://{ MONGO_URI }
MAKEEN_ENV_REGISTRATIONS_4_PLUGIN_OPTIONS_MONGODB_HOST={ MONGO_URI }

Running the API
----------------
- make sure you have mongodb setup locally
- `npm install`
- `NODE_ENV=development npm run dev`
- the API will run on http://localhost:3003/



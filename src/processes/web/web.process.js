const http = require('http');
const util = require('util');
const mongoose = require('mongoose');

const config = require('../../config');
const app = require('./app');
const wss = require('../../modules/wss');

const debug = require('debug')('API:index');
const dbDebug = require('debug')('API:db');

const server = http.createServer(app);

const db = mongoose.connection;
const mongoUri = config.mongo.host;

db.on('connecting', () => debug(`Connecting to database: ${mongoUri}`));
db.on('connected', () => debug(`Connected to database: ${mongoUri}`));
db.once('open', () => debug(`Connection is open to database: ${mongoUri}`));
db.on('error', () => debug(`Unable to connect to database: ${mongoUri}`));
db.on('reconnected', () => debug(`Reconnected to database: ${mongoUri}`));
db.on('disconnected', () => debug(`Disconnected from database: ${mongoUri}`));

mongoose.set('debug', (collectionName, method, query, doc) => {
  dbDebug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
});

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
});

wss.addServer(server);

server.listen(config.port, () => {
  debug(`Server started on port ${config.port} (${config.env})`);
});

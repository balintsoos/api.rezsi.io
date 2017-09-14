const util = require('util');
const mongoose = require('mongoose');

const config = require('./config/main');
const app = require('./config/app');

const debug = require('debug')('API:index');

const mongoUri = config.mongo.host;

mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, {
  promiseLibrary: global.Promise,
  useMongoClient: true,
  keepAlive: true,
});

const db = mongoose.connection;

db.on('connecting', () => debug(`Connecting to to database: ${mongoUri}`));
db.on('connected', () => debug(`Connected to to database: ${mongoUri}`));
db.once('open', () => debug(`Connection is open to database: ${mongoUri}`));
db.on('error', () => debug(`Unable to connect to database: ${mongoUri}`));
db.on('reconnected', () => debug(`Reconnected to database: ${mongoUri}`));
db.on('disconnected', () => debug(`Disconnected from database: ${mongoUri}`));

if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  app.listen(config.port, () => {
    debug(`Server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;

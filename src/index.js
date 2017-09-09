const util = require('util');
const mongoose = require('mongoose');

const config = require('./config/main');
const app = require('./config/app');

const debug = require('debug')('rezsi-io:index');

const mongoUri = config.mongo.host;

mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, {
  promiseLibrary: global.Promise,
  useMongoClient: true,
  keepAlive: true,
});
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${mongoUri}`);
});
mongoose.connection.once('open', () => {
  console.info(`Connected to database: ${mongoUri}`); // eslint-disable-line no-console
});

if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`Server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

module.exports = app;

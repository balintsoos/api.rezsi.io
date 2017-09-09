const util = require('util');
const mongoose = require('mongoose');

const config = require('./config/main');
const app = require('./config/app');

const debug = require('debug')('rezsi.io:index');

Promise = require('bluebird'); // eslint-disable-line no-global-assign

mongoose.Promise = Promise;

const mongoUri = config.mongo.host;

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

mongoose.connect(mongoUri, {
  server: {
    socketOptions: {
      keepAlive: 1,
    },
  },
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

const config = require('../config');

const apiUrl = endpoint => `${config.server.origin}/api/v1${endpoint}`;

const clientUrl = endpoint => `${config.client.origin}${endpoint}`;

module.exports = {
  apiUrl,
  clientUrl,
};

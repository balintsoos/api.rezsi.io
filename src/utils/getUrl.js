const config = require('../config/main');

const apiUrl = endpoint => `${config.server.origin}/api/v1${endpoint}`;

const clientUrl = endpoint => `${config.client.origin}${endpoint}`;

module.exports = {
  apiUrl,
  clientUrl,
};

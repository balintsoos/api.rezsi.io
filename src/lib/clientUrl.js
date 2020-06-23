const config = require('../config');

module.exports = endpoint => `${config.client.origin}${endpoint}`;

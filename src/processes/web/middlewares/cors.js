const cors = require('cors');
const config = require('../../../config/config');

module.exports = () => cors({
  origin: config.client.origin,
  credentials: true,
  exposedHeaders: [
    'Content-Disposition',
  ],
});

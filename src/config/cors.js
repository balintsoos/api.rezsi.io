const cors = require('cors');
const config = require('./main');

module.exports = () => cors({
  origin: config.client.origin,
  credentials: true,
  exposedHeaders: [
    'Content-Disposition',
  ],
});

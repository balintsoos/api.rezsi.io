const url = require('url');
const WebSocket = require('ws');
const mongoose = require('mongoose');

const debug = require('debug')('API:wss');
const Notification = require('../../modules/notification/notification.model');

const makeWSS = require('./core');

const WSS = makeWSS({
  url,
  WebSocket,
  mongoose,
  debug,
  Notification,
});

module.exports = new WSS();

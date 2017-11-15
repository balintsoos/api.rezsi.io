const url = require('url');
const WebSocket = require('ws');
const mongoose = require('mongoose');

const debug = require('debug')('API:wss');
const Notification = require('../models/notification.model');

class WSS {
  constructor() {
    this.sockets = {};
  }

  addServer(server) {
    const wss = new WebSocket.Server({ server });
    wss.on('connection', this.addConnection.bind(this));
  }

  addConnection(socket, req) {
    const location = url.parse(req.url, true);
    const { id } = location.query;

    debug('WebSocket connection: %s', id);

    socket.on('message', WSS.receiveMessage(id));

    this.addSocket(id, socket);
    WSS.sendNotSeenNotifications(id, socket);
  }

  addSocket(id, socket) {
    if (!this.sockets[id]) {
      this.sockets[id] = [];
    }

    this.sockets[id].push(socket);
  }

  sendToUser(id, payload) {
    if (!this.sockets[id]) {
      return;
    }

    const send = WSS.sendToSocket(payload);
    this.sockets[id].forEach(send);
  }

  static receiveMessage(id) {
    return async (msg) => {
      debug('WebSocket message: %O', msg);

      await Notification
        .update({
          user: mongoose.Types.ObjectId(id),
          seen: false,
        }, { seen: true }).exec();
    };
  }

  static async sendNotSeenNotifications(id, socket) {
    const notifications = await Notification
      .find({
        user: mongoose.Types.ObjectId(id),
        seen: false,
      })
      .sort({ createdAt: -1 })
      .exec();

    WSS.sendToSocket(notifications.getPayload())(socket);
  }

  static sendToSocket(payload) {
    return socket => socket.send(JSON.stringify(payload));
  }
}

module.exports = new WSS();

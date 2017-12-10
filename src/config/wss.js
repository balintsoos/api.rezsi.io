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
    this.server = new WebSocket.Server({ server });
    this.server.on('connection', this.addConnection.bind(this));
  }

  addConnection(socket, req) {
    const location = url.parse(req.url, true);
    const { id } = location.query;

    debug('WebSocket connection: %s', id);

    this.addSocket(id, socket);
    WSS.sendNotSeenNotifications(id, socket);
  }

  addSocket(id, socket) {
    if (!this.sockets[id]) {
      this.sockets[id] = [];
    }

    socket.on('message', WSS.onMessage(id));

    this.sockets[id].push(socket);
  }

  removeClosedSockets(id) {
    if (!this.sockets[id]) {
      return;
    }

    this.sockets[id] = this.sockets[id].filter(WSS.isOpen);
  }

  sendToUser(id, payload) {
    if (!this.sockets[id]) {
      return;
    }

    this.removeClosedSockets(id);

    const send = WSS.sendToSocket(payload);
    this.sockets[id].forEach(send);
  }

  static onMessage(id) {
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

    const payload = notifications.map(n => n.getPayload());

    WSS.sendToSocket(payload)(socket);
  }

  static sendToSocket(payload) {
    return socket => socket.send(JSON.stringify(payload), WSS.errorHandler);
  }

  static errorHandler(error) {
    if (!error) {
      return;
    }

    debug('Error on sending %O', error);
  }

  static isOpen(socket) {
    return socket && socket.readyState === WebSocket.OPEN;
  }
}

module.exports = new WSS();

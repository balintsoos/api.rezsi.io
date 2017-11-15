const url = require('url');
const WebSocket = require('ws');

const debug = require('debug')('API:wss');

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

    this.addSocket(id, socket);
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

    const send = this.sendToSocket(payload);

    this.sockets[id].forEach(send);
  }

  static sendToSocket(payload) {
    return socket => socket.send(JSON.stringify(payload));
  }
}

module.exports = new WSS();

const makeWSS = ({
  url,
  WebSocket,
  mongoose,
  debug,
  Notification,
}) => {
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

      this.sockets[id] = this.sockets[id].filter(WSS.isNotClosed);
    }

    sendToUser(id, payload) {
      if (!this.sockets[id]) {
        return;
      }

      this.removeClosedSockets(id);

      const send = WSS.makeSendToSocket(payload);
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

      WSS.makeSendToSocket(payload)(socket);
    }

    static makeSendToSocket(payload) {
      return socket => WSS.isOpen(socket) && socket.send(JSON.stringify(payload), WSS.errorHandler);
    }

    static errorHandler(error) {
      if (!error) {
        return;
      }

      debug('Error on sending %O', error);
    }

    static isOpen(socket) {
      return !!socket && socket.readyState === WebSocket.OPEN;
    }

    static isNotClosed(socket) {
      return !!socket && socket.readyState !== WebSocket.CLOSED;
    }
  }

  return WSS;
};

module.exports = makeWSS;

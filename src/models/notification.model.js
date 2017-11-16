const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  bill: {
    type: Types.ObjectId,
    required: true,
    ref: 'Bill',
  },
  type: {
    type: Types.String,
    required: true,
    enum: ['NEW_BILL'],
  },
  seen: {
    type: Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

notificationSchema.methods.getPayload = function() {
  return {
    id: this.id,
    type: this.type,
    createdAt: this.createdAt,
  };
};

notificationSchema.post('save', (notification) => {
  const id = notification.user.toString();

  wss.sendToUser(id, notification.getPayload()); // eslint-disable-line no-use-before-define
});

module.exports = mongoose.model('Notification', notificationSchema);

// Fix circular dependency issue
// https://medium.com/@robonyong/dealing-with-circular-dependencies-mongoose-in-node-js-36f3b24eb015
const wss = require('../config/wss');

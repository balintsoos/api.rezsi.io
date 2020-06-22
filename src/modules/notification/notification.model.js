const mongoose = require('mongoose');
const debug = require('debug')('API:notification.model');

const User = require('../user/user.model');
const mail = require('../../config/mail');
const newBillEmail = require('../../utils/newBillEmail');
const { clientUrl } = require('../../utils/getUrl');

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

notificationSchema.post('save', async (notification) => {
  const id = notification.user.toString();

  wss.sendToUser(id, notification.getPayload()); // eslint-disable-line no-use-before-define

  const user = await User.findById(id).exec();

  if (!user) {
    debug('USER_NOT_FOUND');
    return;
  }

  try {
    await mail.send({
      to: user.email,
      subject: 'New bill',
      html: newBillEmail({
        name: user.displayName,
        url: clientUrl('/user?tab=bills'),
      }),
    });
  } catch (err) {
    debug('EMAIL_SEND_FAILED %O', err);
  }
});

module.exports = mongoose.model('Notification', notificationSchema);

// Fix circular dependency issue
// https://medium.com/@robonyong/dealing-with-circular-dependencies-mongoose-in-node-js-36f3b24eb015
const wss = require('../../config/wss');

const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const groupSchema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: true,
    trim: true,
  },
  leader: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Group', groupSchema);

const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const groupSchema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: true,
    trim: true,
  },
  hotWaterPrice: {
    type: Types.Number,
    required: true,
    min: 0,
  },
  coldWaterPrice: {
    type: Types.Number,
    required: true,
    min: 0,
  },
  heatPrice: {
    type: Types.Number,
    required: true,
    min: 0,
  },
  leader: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  disabled: {
    type: Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

groupSchema.methods.getPayload = function() {
  return {
    id: this.id,
    name: this.name,
    createdAt: this.createdAt,
    hotWaterPrice: this.hotWaterPrice,
    coldWaterPrice: this.coldWaterPrice,
    heatPrice: this.heatPrice,
  };
};

module.exports = mongoose.model('Group', groupSchema);

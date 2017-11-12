const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const billSchema = new mongoose.Schema({
  hotWaterConsumption: {
    type: Types.Number,
    required: true,
    min: 0,
  },
  coldWaterConsumption: {
    type: Types.Number,
    required: true,
    min: 0,
  },
  heatConsumption: {
    type: Types.Number,
    required: true,
    min: 0,
  },
  summary: {
    type: Types.ObjectId,
    required: true,
    ref: 'Summary',
  },
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

billSchema.methods.getPayload = function() {
  return {
    id: this.id,
    hotWaterConsumption: this.hotWaterConsumption,
    coldWaterConsumption: this.coldWaterConsumption,
    heatConsumption: this.heatConsumption,
    createdAt: this.createdAt,
    summary: this.summary.getPayload(),
  };
};

module.exports = mongoose.model('Bill', billSchema);

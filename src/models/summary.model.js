const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const summarySchema = new mongoose.Schema({
  from: {
    type: Types.Date,
    required: [true, 'MISSING'],
  },
  to: {
    type: Types.Date,
    required: [true, 'MISSING'],
  },
  hotWaterPrice: {
    type: Types.Number,
    required: [true, 'MISSING'],
    min: [0, 'MINUS'],
  },
  coldWaterPrice: {
    type: Types.Number,
    required: [true, 'MISSING'],
    min: [0, 'MINUS'],
  },
  heatPrice: {
    type: Types.Number,
    required: [true, 'MISSING'],
    min: [0, 'MINUS'],
  },
  currency: {
    type: Types.String,
    required: [true, 'MISSING'],
  },
  group: {
    type: Types.ObjectId,
    required: true,
    ref: 'Group',
  },
}, {
  timestamps: true,
});

summarySchema.methods.getPayload = function() {
  return {
    id: this.id,
    from: this.from,
    to: this.to,
    hotWaterPrice: this.hotWaterPrice,
    coldWaterPrice: this.coldWaterPrice,
    heatPrice: this.heatPrice,
    currency: this.currency,
  };
};

module.exports = mongoose.model('Summary', summarySchema);

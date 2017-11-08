const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const summarySchema = new mongoose.Schema({
  from: {
    type: Types.Date,
    required: true,
  },
  to: {
    type: Types.Date,
    required: true,
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
  currency: {
    type: Types.String,
    required: true,
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

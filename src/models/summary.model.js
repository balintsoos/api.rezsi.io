const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const validateCurrency = currency => currency && currency.trim() !== '';
const validateTo = function(to) {
  return this.from < to;
};

const summarySchema = new mongoose.Schema({
  from: {
    type: Types.Date,
    required: [true, 'MISSING'],
  },
  to: {
    type: Types.Date,
    required: [true, 'MISSING'],
    validate: {
      validator: validateTo,
      message: 'EARLIER',
    },
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
    trim: true,
    validate: {
      validator: validateCurrency,
      message: 'EMPTY',
    },
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

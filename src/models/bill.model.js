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
    total: this.calculateTotal(),
  };
};

billSchema.methods.calculateTotal = function() {
  const items = [
    {
      quantity: this.heatConsumption,
      unitPrice: this.summary.heatPrice,
    },
    {
      quantity: this.hotWaterConsumption,
      unitPrice: this.summary.hotWaterPrice,
    },
    {
      quantity: this.coldWaterConsumption,
      unitPrice: this.summary.coldWaterPrice,
    },
  ];

  const total = items
    .map(item => item.quantity * item.unitPrice)
    .reduce((sum, subtotal) => sum + subtotal);

  return total;
};

module.exports = mongoose.model('Bill', billSchema);

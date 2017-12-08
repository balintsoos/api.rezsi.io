const mongoose = require('mongoose');

const { Types } = mongoose.Schema;

const reportSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
  },
  hotWater: {
    type: Types.Number,
    required: [true, 'MISSING'],
    min: [0, 'MINUS'],
  },
  coldWater: {
    type: Types.Number,
    required: [true, 'MISSING'],
    min: [0, 'MINUS'],
  },
  heat: {
    type: Types.Number,
    required: [true, 'MISSING'],
    min: [0, 'MINUS'],
  },
}, {
  timestamps: true,
});

reportSchema.methods.getPayload = function() {
  return {
    id: this.id,
    hotWater: this.hotWater,
    coldWater: this.coldWater,
    heat: this.heat,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Report', reportSchema);

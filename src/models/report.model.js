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

reportSchema.post('validate', async (report, next) => {
  const errors = {};

  // eslint-disable-next-line no-use-before-define
  const lastReport = await Report
    .findOne({ user: report.user })
    .sort({ createdAt: -1 })
    .exec();

  if (!lastReport) {
    return next();
  }

  if (lastReport.hotWater > report.hotWater) {
    errors.hotWater = { message: 'LESS' };
  }

  if (lastReport.coldWater > report.coldWater) {
    errors.coldWater = { message: 'LESS' };
  }

  if (lastReport.heat > report.heat) {
    errors.heat = { message: 'LESS' };
  }

  if (Object.keys(errors).length !== 0) {
    const error = new Error();
    error.errors = errors;
    return next(error);
  }

  return next();
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

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

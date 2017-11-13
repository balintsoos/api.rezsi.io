const httpStatus = require('http-status');

const Summary = require('../models/summary.model');
const Bill = require('../models/bill.model');
const User = require('../models/user.model');
const Report = require('../models/report.model');

const consumption = (current, last, key) => current[key] - last[key];

async function create(req, res) {
  let summary = new Summary(Object.assign({}, req.body, {
    group: req.group.id,
  }));

  try {
    summary = await summary.save();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  let users;

  try {
    users = await User.find({ group: req.group.id }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  users.forEach(async (user) => {
    const reports = await Report
      .find({
        user: user.id,
        createdAt: {
          $gte: new Date(summary.from),
          $lte: new Date(summary.to),
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    const lastReports = await Report
      .find({
        user: user.id,
        createdAt: {
          $lt: new Date(summary.from),
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    let consumptions = {
      hotWater: 0,
      coldWater: 0,
      heat: 0,
    };

    if (reports.length > 0 && lastReports.length > 0) {
      consumptions = {
        hotWater: consumption(reports[0], lastReports[0], 'hotWater'),
        coldWater: consumption(reports[0], lastReports[0], 'coldWater'),
        heat: consumption(reports[0], lastReports[0], 'heat'),
      };
    }

    const bill = new Bill({
      hotWaterConsumption: consumptions.hotWater,
      coldWaterConsumption: consumptions.coldWater,
      heatConsumption: consumptions.heat,
      summary: summary.id,
      user: user.id,
    });

    try {
      await bill.save();
    } catch (err) {
      res.status(httpStatus.BAD_REQUEST).json(err);
    }
  });

  return res.status(httpStatus.CREATED).json(summary.getPayload());
}

async function getAllOfGroup(req, res) {
  let summaries;

  try {
    summaries = await Summary
      .find({ group: req.group.id })
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(summaries.map(summary => summary.getPayload()));
}

module.exports = {
  create,
  getAllOfGroup,
};

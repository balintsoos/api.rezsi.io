const mongoose = require('mongoose');
const httpStatus = require('http-status');
const json2csv = require('json2csv');

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

    try {
      await Bill.create({
        hotWaterConsumption: consumptions.hotWater,
        coldWaterConsumption: consumptions.coldWater,
        heatConsumption: consumptions.heat,
        summary: summary.id,
        user: user.id,
      });
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

async function getOneAsCsvOfGroup(req, res) {
  let bills;

  try {
    bills = await Bill
      .find({ summary: mongoose.Types.ObjectId(req.params.summaryId) })
      .populate('user')
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  let csv;
  const filename = `${req.params.summaryId}.csv`;
  const fields = [
    { label: 'User', value: 'user.displayName' },
    { label: 'Heat consumption', value: 'heatConsumption' },
  ];

  try {
    csv = json2csv({ fields, data: bills, defaultValue: 'NULL' });
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  res.attachment(filename);
  return res.status(200).send(csv);
}

module.exports = {
  create,
  getAllOfGroup,
  getOneAsCsvOfGroup,
};

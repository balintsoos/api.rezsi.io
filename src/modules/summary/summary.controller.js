const mongoose = require('mongoose');
const httpStatus = require('http-status');
const json2csv = require('json2csv');

const Summary = require('./summary.model');
const Bill = require('../bill/bill.model');
const User = require('../../modules/user/user.model');
const Report = require('../report/report.model');

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
    users = await User.find({
      role: 'MEMBER',
      group: req.group.id,
      confirmed: true,
      disabled: false,
    }).exec();
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
      .populate('summary')
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  let csv;
  const filename = `${req.params.summaryId}.csv`;
  const fields = [
    { label: 'User', value: 'user.displayName' },
    { label: 'Email', value: 'user.email' },
    { label: 'Heat consumption', value: 'heatConsumption' },
    { label: 'Heat unit price', value: 'summary.heatPrice' },
    { label: 'Heat price', value: bill => bill.heatConsumption * bill.summary.heatPrice },
    { label: 'Hot water consumption', value: 'hotWaterConsumption' },
    { label: 'Hot water unit price', value: 'summary.hotWaterPrice' },
    { label: 'Hot water price', value: bill => bill.hotWaterConsumption * bill.summary.hotWaterPrice },
    { label: 'Cold water consumption', value: 'coldWaterConsumption' },
    { label: 'Cold water unit price', value: 'summary.coldWaterPrice' },
    { label: 'Cold water price', value: bill => bill.coldWaterConsumption * bill.summary.coldWaterPrice },
    { label: 'Currency', value: 'summary.currency' },
    { label: 'Total', value: bill => bill.calculateTotal() },
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

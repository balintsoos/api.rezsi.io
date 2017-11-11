const httpStatus = require('http-status');

const Summary = require('../models/summary.model');
const Bill = require('../models/bill.model');
const User = require('../models/user.model');

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
    const bill = new Bill({
      hotWaterConsumption: 0, // TODO
      coldWaterConsumption: 0,
      heatConsumption: 0,
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

const httpStatus = require('http-status');

const Summary = require('../models/summary.model');

async function create(req, res) {
  let summary = new Summary(Object.assign({}, req.body, {
    group: req.group.id,
  }));

  try {
    summary = await summary.save();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

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

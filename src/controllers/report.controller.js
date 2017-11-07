const httpStatus = require('http-status');

const Report = require('../models/report.model');

async function create(req, res) {
  let report = new Report(Object.assign({}, req.body, {
    user: req.user.id,
  }));

  try {
    report = await report.save();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.status(httpStatus.CREATED).json(report.getPayload());
}

async function getAllOfUser(req, res) {
  let reports;

  try {
    reports = await Report
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(reports.map(report => report.getPayload()));
}

module.exports = {
  create,
  getAllOfUser,
};

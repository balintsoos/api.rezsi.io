const httpStatus = require('http-status');
const mongoose = require('mongoose');

const Report = require('../models/report.model');
const User = require('../models/user.model');

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

async function getAllOfGroup(req, res) {
  let reports;
  let users;

  try {
    users = await User.find({
      role: 'MEMBER',
      group: mongoose.Types.ObjectId(req.params.id),
      confirmed: true,
    }).sort({ createdAt: -1 }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  users.forEach(async (user) => { // TODO
    let reportsOfUser;

    try {
      reportsOfUser = await Report
        .find({ user: user.id })
        .sort({ createdAt: -1 })
        .exec();
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json(err);
    }

    reports = [...reports, ...reportsOfUser];
  });

  return res.json(reports.map(report => report.getPayload()));
}

async function getAllOfUser(req, res) {
  let reports;

  try {
    reports = await Report.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(reports.map(report => report.getPayload()));
}

module.exports = {
  create,
  getAllOfGroup,
  getAllOfUser,
};

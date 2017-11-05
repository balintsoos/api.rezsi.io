const httpStatus = require('http-status');
const mongoose = require('mongoose');

const Group = require('../models/group.model');
const User = require('../models/user.model');
const Report = require('../models/report.model');

function getAllOfUser(req, res) {
  const { limit = 10, skip = 0 } = req.query;

  Group.find({ leader: req.user.id })
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(groups => res.json(groups.map(group => group.getPayload())))
    .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}

async function getOneOfUser(req, res) {
  let group;
  let users;

  try {
    group = await Group.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      leader: req.user.id,
    }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (!group) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    users = await User.find({
      role: 'MEMBER',
      group: group.id,
      confirmed: true,
    }).sort({ createdAt: -1 }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(Object.assign({}, group.getPayload(), {
    users: users.map(user => user.getPayload()),
  }));
}

async function create(req, res) {
  let group = new Group(Object.assign({}, req.body, {
    leader: req.user.id,
  }));

  try {
    group = await group.save();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.status(httpStatus.CREATED).json(group.getPayload());
}

async function getMemberOfGroup(req, res) {
  let user;
  let reports;

  try {
    user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.userId),
      role: 'MEMBER',
      group: mongoose.Types.ObjectId(req.params.groupId),
      confirmed: true,
    }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST);
  }

  try {
    reports = await Report
      .find({ user: user.id })
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(Object.assign({ reports }, user.getPayload()));
}

async function deleteMemberOfGroup(req, res) {
  let deletedUser;

  try {
    deletedUser = await User.findByIdAndRemove(req.params.userId).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  await Report.remove({ user: deletedUser.id }).exec();

  return res.json({ id: deletedUser.id });
}

module.exports = {
  getAllOfUser,
  getOneOfUser,
  create,
  getMemberOfGroup,
  deleteMemberOfGroup,
};

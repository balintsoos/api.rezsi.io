const httpStatus = require('http-status');
const mongoose = require('mongoose');

const Group = require('../models/group.model');
const User = require('../models/user.model');

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

async function getAllOfLeader(req, res) {
  let groups;

  try {
    groups = await Group
      .find({
        leader: req.user.id,
        disabled: false,
      })
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(groups.map(group => group.getPayload()));
}

async function getOneOfLeader(req, res) {
  let group;
  let users;

  try {
    group = await Group.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      leader: req.user.id,
      disabled: false,
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
      disabled: false,
    }).sort({ createdAt: -1 }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(Object.assign({}, group.getPayload(), {
    users: users.map(user => user.getPayload()),
  }));
}

async function updateOneOfLeader(req, res) {
  let updatedGroup;

  try {
    updatedGroup = await Group
      .findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.id),
        disabled: false,
      }, req.body, { new: true })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(updatedGroup.getPayload());
}

async function deleteOneOfLeader(req, res) {
  let deletedGroup;

  try {
    deletedGroup = await Group
      .findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.id),
        disabled: false,
      }, { disabled: true }, { new: true })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  await User.update({
    group: deletedGroup.id,
  }, { disabled: true }, { multi: true }).exec();

  return res.json({ id: deletedGroup.id });
}

module.exports = {
  create,
  getAllOfLeader,
  getOneOfLeader,
  updateOneOfLeader,
  deleteOneOfLeader,
};

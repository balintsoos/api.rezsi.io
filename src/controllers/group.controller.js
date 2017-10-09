const httpStatus = require('http-status');
const mongoose = require('mongoose');

const Group = require('../models/group.model');
const User = require('../models/user.model');

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

module.exports = {
  getAllOfUser,
  getOneOfUser,
  create,
};

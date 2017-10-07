const httpStatus = require('http-status');
const mongoose = require('mongoose');

const Group = require('../models/group.model');

function getAllOfUser(req, res) {
  const { limit = 10, skip = 0 } = req.query;

  Group.find({ leader: req.user.id })
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(groups => res.json(groups))
    .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}

async function getOneOfUser(req, res) {
  let group;

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

  return res.json(group);
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

  return res.status(httpStatus.CREATED).json(group);
}

module.exports = {
  getAllOfUser,
  getOneOfUser,
  create,
};

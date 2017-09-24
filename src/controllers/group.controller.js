const httpStatus = require('http-status');

const Group = require('../models/group.model');

function getAll(req, res) {
  const { limit = 10, skip = 0 } = req.query;

  Group.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(groups => res.json(groups))
    .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}

function getOne(req, res) {
  Group.findById(req.params.id)
    .exec()
    .then((group) => {
      if (!group) {
        return Promise.reject();
      }

      return group;
    })
    .then(group => res.json(group))
    .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
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
  getAll,
  getOne,
  create,
};

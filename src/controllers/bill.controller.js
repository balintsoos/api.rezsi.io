const httpStatus = require('http-status');

const Bill = require('../models/bill.model');

async function create(req, res) {
  let bill = new Bill(Object.assign({}, req.body, {
    group: req.group.id,
  }));

  try {
    bill = await bill.save();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.status(httpStatus.CREATED).json(bill.getPayload());
}

async function getAllOfGroup(req, res) {
  let bills;

  try {
    bills = await Bill
      .find({ group: req.group.id })
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(bills.map(bill => bill.getPayload()));
}

module.exports = {
  create,
  getAllOfGroup,
};

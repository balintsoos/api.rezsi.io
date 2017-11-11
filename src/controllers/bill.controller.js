const httpStatus = require('http-status');

const Bill = require('../models/bill.model');

async function getAllOfMember(req, res) {
  let bills;

  try {
    bills = await Bill
      .find({ user: req.member.id })
      .populate('summary')
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(bills.map(bill => bill.getPayload()));
}

module.exports = {
  getAllOfMember,
};

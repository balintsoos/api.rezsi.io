const mongoose = require('mongoose');
const httpStatus = require('http-status');

const Bill = require('../../models/bill.model');
const billPdf = require('../../utils/billPdf');

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

async function getOneAsPdfOfMember(req, res) {
  let bill;

  try {
    bill = await Bill
      .findOne({
        _id: mongoose.Types.ObjectId(req.params.billId),
        user: req.member.id,
      })
      .populate('summary')
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (!bill) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const filename = `${bill.id.toString()}.pdf`;
  const htmlContent = billPdf(bill.getPayload());

  return res.pdfFromHTML({ filename, htmlContent });
}

module.exports = {
  getAllOfMember,
  getOneAsPdfOfMember,
};

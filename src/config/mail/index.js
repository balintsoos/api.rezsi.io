const nodemailer = require('nodemailer');
const debug = require('debug')('API:mail');

const config = require('../config');

const {
  makeTransport,
  makeSend,
} = require('./core');

const transport = makeTransport({ nodemailer, config });
const send = makeSend({ transport, config, debug });

module.exports = {
  send,
};

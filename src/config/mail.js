const nodemailer = require('nodemailer');
const debug = require('debug')('API:mail');

const config = require('./main');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass,
  },
});

function send({
  to, subject, text, html,
}) {
  const options = {
    from: config.gmail.address,
    bcc: config.gmail.address,
    to,
    subject,
    text,
    html,
  };

  debug('SEND %O', options);

  return new Promise((resolve, reject) => {
    transport.sendMail(options, (error, info) => {
      if (error) {
        debug('SEND FAILED %O', error);
        return reject(error);
      }

      debug('SEND SUCCESS %O', info);
      return resolve(info);
    });
  });
}

module.exports = send;

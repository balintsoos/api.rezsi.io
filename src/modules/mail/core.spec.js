/* eslint-disable no-unused-expressions, arrow-body-style */
const { expect } = require('chai');
const sinon = require('sinon');

const {
  makeTransport,
  makeSend,
} = require('./core');

const nodemailer = {
  createTransport: options => options,
};

const config = {
  gmail: {
    user: 'user',
    pass: 'pass',
    address: 'address',
  },
};

describe('Mail Service', () => {
  let transport;
  let send;
  let debug;

  describe('transport module', () => {
    beforeEach(() => {
      transport = makeTransport({ nodemailer, config });
    });

    describe('if nodemailer provided', () => {
      it('should create a Gmail SMTP transporter', () => {
        expect(transport.service).to.equal('gmail');
      });

      it('should use gmail username for authentication', () => {
        expect(transport.auth.user).to.equal('user');
      });

      it('should use gmail password for authentication', () => {
        expect(transport.auth.pass).to.equal('pass');
      });
    });
  });

  describe('send method', () => {
    describe('if transport provided', () => {
      beforeEach(() => {
        transport = {
          sendMail: sinon.spy((options, callback) => callback(null, 'info')),
        };

        debug = sinon.spy();
        send = makeSend({ transport, config, debug });
      });

      it('should call debug with options', () => {
        return send({
          to: 'to',
          subject: 'sub',
          text: 'text',
          html: 'html',
        }).then(() => {
          expect(debug.getCall(0).args[0]).to.equal('SEND %O');
          expect(debug.getCall(0).args[1]).to.deep.equal({
            from: 'address',
            bcc: 'address',
            to: 'to',
            subject: 'sub',
            text: 'text',
            html: 'html',
          });
        });
      });

      it('should call sendMail', () => {
        return send({
          to: 'to',
          subject: 'sub',
          text: 'text',
          html: 'html',
        }).then(() => {
          expect(transport.sendMail.called).to.be.true;
        });
      });

      it('should call sendMail with options as the first argument', () => {
        return send({
          to: 'to',
          subject: 'sub',
          text: 'text',
          html: 'html',
        }).then(() => {
          expect(transport.sendMail.getCall(0).args[0]).to.deep.equal({
            from: 'address',
            bcc: 'address',
            to: 'to',
            subject: 'sub',
            text: 'text',
            html: 'html',
          });
        });
      });
    });

    describe('if error occured', () => {
      beforeEach(() => {
        transport = {
          sendMail: sinon.spy((options, callback) => callback('error')),
        };

        debug = sinon.spy();
        send = makeSend({ transport, config, debug });
      });

      it('should reject promise with error', () => {
        return send({
          to: 'to',
          subject: 'sub',
          text: 'text',
          html: 'html',
        }).catch((error) => {
          expect(error).to.equal('error');
        });
      });

      it('should call debug with error message', () => {
        return send({
          to: 'to',
          subject: 'sub',
          text: 'text',
          html: 'html',
        }).catch(() => {
          expect(debug.getCall(1).args[0]).to.equal('SEND FAILED %O');
          expect(debug.getCall(1).args[1]).to.equal('error');
        });
      });
    });

    describe('if no error occured', () => {
      beforeEach(() => {
        transport = {
          sendMail: sinon.spy((options, callback) => callback(null, 'info')),
        };

        debug = sinon.spy();
        send = makeSend({ transport, config, debug });
      });

      it('should resolve promise with info', () => {
        return send({
          to: 'to',
          subject: 'sub',
          text: 'text',
          html: 'html',
        }).then((info) => {
          expect(info).to.equal('info');
        });
      });

      it('should call debug with success message', () => {
        return send({
          to: 'to',
          subject: 'sub',
          text: 'text',
          html: 'html',
        }).then(() => {
          expect(debug.getCall(1).args[0]).to.equal('SEND SUCCESS %O');
          expect(debug.getCall(1).args[1]).to.equal('info');
        });
      });
    });
  });
});

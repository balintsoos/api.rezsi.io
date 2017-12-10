/* eslint-disable no-unused-expressions */

// More tests: http://jsfiddle.net/ghvj4gy9/embedded/result,js/

const { expect } = require('chai');
const validateEmail = require('.');

describe('validateEmail', () => {
  describe('if given email is valid', () => {
    it('should return true', () => {
      expect(validateEmail('somebody@example.com')).to.be.true;
    });
  });

  describe('if given email is invalid', () => {
    it('should return false', () => {
      expect(validateEmail('somebody@.@example')).to.be.false;
    });
  });

  describe('if given email missing', () => {
    it('should return false', () => {
      expect(validateEmail('')).to.be.false;
    });
  });

  describe('if given email has no domain', () => {
    it('should return false', () => {
      expect(validateEmail('somebody@example')).to.be.false;
    });
  });

  describe('if given email has only one character in domain', () => {
    it('should return false', () => {
      expect(validateEmail('somebody@example.c')).to.be.false;
    });
  });

  describe('if given email has ip domain', () => {
    it('should return false', () => {
      expect(validateEmail('somebody@127.0.0.1')).to.be.false;
    });
  });
});

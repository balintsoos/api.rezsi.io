/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const validateEmail = require('.');

describe('validateEmail', () => {
  describe('if given email is valid', () => {
    it('should return true', () => {
      expect(validateEmail('a@a.hu')).to.be.true;
    });
  });

  describe('if given email is invalid', () => {
    it('should return false', () => {
      expect(validateEmail('a@a.@.hu')).to.be.false;
    });
  });
});

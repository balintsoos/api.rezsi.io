const { expect } = require('chai');
const getEmailDomain = require('.');

describe('getEmailDomain', () => {
  describe('if given email has 1 @ sign', () => {
    it('should return the domain', () => {
      expect(getEmailDomain('a@a.hu')).to.equal('a.hu');
    });
  });

  describe('if given email has more than 1 @ sign', () => {
    it('should return the domain', () => {
      expect(getEmailDomain('a@a@a.hu')).to.equal('a.hu');
    });
  });
});

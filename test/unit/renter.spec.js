/* eslint-disable max-len, no-unused-expressions */
const expect = require('chai').expect;
const sinon = require('sinon');
const Renter = require('../../dst/models/renter');
const Apartment = require('../../dst/models/apt');

describe('renter', () => {
  beforeEach(() => {
    sinon.stub(Renter, 'find').yields(null, []);
  });
  afterEach(() => {
    Renter.find.restore();
  });
  describe('constructor', () => {
    it('should create a new renter', (done) => {
      const renter = new Renter({ name: 'bill', money: 10000 });
      renter.validate((err) => {
        expect(err).to.be.undefined;
        expect(renter.name).to.equal('bill');
        expect(renter.complaints).to.equal(0);
        expect(renter.money).to.equal(10000);
        done();
      });
    });
    it('should NOT create a new renter - no name', (done) => {
      const renter = new Renter({ money: 10000 });
      renter.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a new renter - not enough money', (done) => {
      const renter = new Renter({ name: 'Timmy', money: 5 });
      renter.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a new renter - name too short', (done) => {
      const renter = new Renter({ name: 'T', money: 5000 });
      renter.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
  describe('#pay', () => {
    it('should pay rent', sinon.test(function(done) {
      const renter = new Renter({ name: 'bill', money: 10000, apartment: 12345 });
      sinon.stub(Apartment, 'findById').yields(null, { rent: 1200, rentCollected: 2400 });
      renter.pay((err, apartment) => {
        expect(err).to.be.undefined;
        expect(apartment.rentCollected).to.equal(3600);
        expect(renter.money).to.equal(8800);
        done();
      });
    }));
  });
});

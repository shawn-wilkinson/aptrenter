/* eslint-disable max-len, no-unused-expressions */
const expect = require('chai').expect;
const sinon = require('sinon');
const Apartment = require('../../dst/models/apt');
const Renter = require('../../dst/models/renter');

describe('apartment', () => {
  beforeEach(() => {
    sinon.stub(Apartment, 'find').yields(null, []);
  });
  afterEach(() => {
    Apartment.find.restore();
  });
  describe('constructor', () => {
    it('creates a new apartment', (done) => {
      const apt1 = new Apartment({ name: 'A1', sqft: 1000, floor: 1, rent: 2200,
      deposit: 1000, leaseEndDate: new Date('2016-10-31'), dueDate: 5,
      lateFee: 50 });
      apt1.validate((err) => {
        expect(err).to.be.undefined;
        expect(apt1.collectedRent).to.equal(0);
        done();
      });
    });
    it('does not create a new apartment - no name', (done) => {
      const apt1 = new Apartment({ sqft: 1000, floor: 1, rent: 2200,
      deposit: 1000, leaseEndDate: new Date('2016-10-31'), dueDate: 5,
      lateFee: 50 });
      apt1.validate((err) => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('does not create a new apartment - floor too high', (done) => {
      const apt1 = new Apartment({ name:'C17', sqft: 1000, floor: 5, rent: 2200,
      deposit: 1000, leaseEndDate: new Date('2016-10-31'), dueDate: 5,
      lateFee: 50 });
      apt1.validate((err) => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('does not create a new apartment - duplicate name', (done) => {
      Apartment.find.yields(null, [{ name: 'C17' }]);
      const apt1 = new Apartment({ name:'C17', sqft: 1000, floor: 4, rent: 2200,
      deposit: 1000, leaseEndDate: new Date('2016-10-31'), dueDate: 5,
      lateFee: 50 });
      apt1.validate((err) => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
  describe('#lease', () => {
    it('should validate the renter can lease an apartment', sinon.test(function (done) {
      sinon.stub(Renter, 'findById').yields(null, { id: '12345', money: 5000, apartment: '' })
      const apt1 = new Apartment({ name: 'A1', sqft: 1000, floor: 1, rent: 2200,
      deposit: 1000, leaseEndDate: new Date('2016-10-31'), dueDate: 5,
      lateFee: 50 });
      apt1.lease('12345', (err, renter) => {
        expect(err).to.be.undefined;
        expect(renter.money).to.equal(4000);
        expect(apt1.renter).to.equal('12345');
        done();
      });
    }));
  });
});

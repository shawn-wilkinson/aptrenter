/* eslint-disable no-param-reassign, no-underscore-dangle */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Renter from './renter';

function duplicateAptName(name, cb) {
  this.model('Apartment').find({ name }, (err, apartments) => {
    cb(!apartments.length);
  });
}

const aptSchema = new Schema ({
  name: { type: String, required: true, validate: { validator: duplicateAptName } },
  sqft: { type: Number, required: true, min: 500, max: 2500 },
  floor: { type: Number, required: true, min: 1, max: 4 },
  rent: { type: Number, required: true, min: 1000 },
  deposit: { type: Number, required: true, min: 50 },
  collectedRent: { type: Number, default: 0, min: 0 },
  dueDate: { type: Number, required: true, min: 1, max: 31 },
  lateFee: { type: Number, required: true, min: 10 },
  leaseEndDate: { type: Date, required: true },
  renter: { type: String, default: '' },
});

aptSchema.methods.lease = function(renterId, cb) {
  Renter.findById(renterId, (err, renter) => {
    if (!renter) {
      return cb(new Error('renter not fount'));
    }
    if (renter.money > this.deposit) {
      renter.money -= this.deposit;
      renter.apartment = this._id;
      this.renter = renter.id;
      cb(undefined, renter);
    } else {
      cb(new Error('not enough funds'));
    }
  });
};

module.exports = mongoose.model('Apartment', aptSchema);


/*
apt:
name unique
sqft 50-2500
floor 1 - 4
rent max 1000
deposit min 50
lease end date
collected rent min 0
due date
late fee min 10
renter


lease
  renter pays deposit

complaint filed
  if count = 3, evict renter
    no deposit
    break link

lease expired
  deposit returned
  break link
*/

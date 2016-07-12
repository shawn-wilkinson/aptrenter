/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const renterSchema = new Schema({
  name: { type: String, required: true, minlength: 2 },
  money: { type: Number, required: true, min: 1000 },
  apartment: { type: String },
  complaints: { type: Number, default: 0, max: 3, min: 0 },
});

renterSchema.methods.pay = function (cb) {
  this.model('Apartment').findById({ id: this.apartment }, (err, apartment) => {
    if (this.money >= apartment.rent) {
      this.money -= apartment.rent;
      apartment.rentCollected += apartment.rent;
      return cb(undefined, apartment);
    } else {
      return cb(new Error('not enough funds'));
    }
  });
}

module.exports = mongoose.model('Renter', renterSchema);


/*
renter:
name min len 2
money at least 1000
apt
complaints 0-3
*/


// pay rent
//    check for late fee
// terminate
//    early termination fee 1 month rent
//    no deposit

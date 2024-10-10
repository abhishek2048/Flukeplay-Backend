const mongoose = require("mongoose");
const moment = require("moment-timezone");
const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  username: {
    type:String,
    required: true,
  },
  psycname: {
    type:String,
    required: true,
  },
  userEmail: {
    type: String,
    required: false
  },
  psychologistId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Psychologist",
  },
  slot:{
    type: String,
    required:true,
  },
  duration: {
    type: Number,
    default: 30,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => moment().tz("Asia/Kolkata").format(),
  }
});
const BookingModel = mongoose.model("Booking", BookingSchema);
module.exports = BookingModel;

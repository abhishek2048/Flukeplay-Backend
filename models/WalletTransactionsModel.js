const mongoose = require("mongoose");
const moment = require("moment-timezone");
const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  closingBalance: {
    type: Number,
    required: true,
  },
  //transaction type
  type: {
    type: String,
    enum: ["UPI", "NET BANKING", "DRAFT"],
  },

  paymentId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => moment().tz("Asia/Kolkata").format(),
  }
});

const walletModal = mongoose.model("WalletTransaction", WalletSchema);
module.exports = walletModal;

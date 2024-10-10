const mongoose = require("mongoose");
const moment = require("moment-timezone");
const DeleteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  fname: {
    type: String,
    required: true,
  },
  mname: {
    type: String,
    required: false,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required:true
  },
  createdAt: {
    type: String,
    default: () => moment().tz("Asia/Kolkata").format(),
  }
});
const DeleteModel = mongoose.model("Delete", DeleteSchema);
module.exports = DeleteModel;

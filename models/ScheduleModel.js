const mongoose = require("mongoose");
const PsychologistModel = require("./PsychologistModel");
const UserModel = require("./UserModel");
const { slotTimings } = require("../utils/constants.js");
const moment = require("moment-timezone");

const ScheduleSchema = new mongoose.Schema({
  psychologistId: {
    type: mongoose.Types.ObjectId,
    ref: PsychologistModel,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: UserModel,
  },
  date: {
    type: Date,
    required: true,
  },
  slots:[
    { 
    type: String, 
    enum: slotTimings, 
    }
  ],
  createdAt: {
    type: String,
    default: () => moment().tz("Asia/Kolkata").format(),
  }
});

const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
module.exports = ScheduleModel;

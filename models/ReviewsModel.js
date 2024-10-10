const mongoose = require("mongoose");
const moment = require("moment-timezone");

const ReviewsModelSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stars: {
    type: Number,
  },
  review: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").format(),
  },
});

const ReviewModel = mongoose.model("Review", ReviewsModelSchema);
module.exports = ReviewModel;

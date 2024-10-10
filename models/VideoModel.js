const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { videoCategory } = require("../utils/constants");

const VideoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    videoTitle: {
        type: String,
        required: true,
    },
    videoURL: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: videoCategory,
        required: true,
    },
    paid : {
        type: Boolean,
        default: false
    },
    thumbnail : {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: () => moment().tz("Asia/Kolkata").format(),
    },
    inHomeScreen : {
        type: Boolean,
        default: false,
    }
});

// VideoSchema.methods.updator = async function () {
//   const currentDate = Date.now();
//   await this.populate("userId");
//   this.sessions.filter((session) => {
//     return session.date >= currentDate;
//   });
//   return await this.save();
// };

const VideoModel = mongoose.model("Video", VideoSchema);
module.exports = VideoModel;

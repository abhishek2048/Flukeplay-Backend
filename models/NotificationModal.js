const mongoose = require('mongoose');
const moment = require("moment-timezone");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true,
        },
        videoId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Video', 
        },
        title: {
            type: String, 
            required: true 
        },
        message: { 
            type: String, 
            required: true 
        },
        createdAt: {
          type: String,
          default: () => moment().tz("Asia/Kolkata").format(),
        },
        isRead: { 
            type: Boolean, 
            default: false 
        },
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

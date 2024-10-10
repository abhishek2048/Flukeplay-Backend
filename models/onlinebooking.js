const mongoose = require("mongoose");
const onlineBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    professionalId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    bookingAmt: {
        type: Number,
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    sessionStatus: {
        type: Boolean,
        required: true
    }

})

const bookingModal = mongoose.model("onlineBooking", onlineBookingSchema);
module.exports = bookingModal;
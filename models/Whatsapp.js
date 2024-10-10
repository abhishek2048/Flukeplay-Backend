const mongoose = require("mongoose");
const moment = require("moment-timezone");
const WhatsappSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: () => moment().tz("Asia/Kolkata").format(),
    }
});
const WhatsappModel = mongoose.model("link", WhatsappSchema);
module.exports = WhatsappModel;

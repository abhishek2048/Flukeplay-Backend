const mongoose = require("mongoose");
const moment = require("moment-timezone");
const CategorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required:true,
    },
    createdAt: {
        type: String,
        default: () => moment().tz("Asia/Kolkata").format(),
    }
});
const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;

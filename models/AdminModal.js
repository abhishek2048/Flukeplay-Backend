const mongoose = require("mongoose");
const moment = require("moment-timezone");
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is necessary"],
  },
  fromGoogle: {
    type:Boolean,
    default:false
  },
  password: {
    type: String,
    required: function(){
      if(this.fromGoogle){
          return false;
      }
      return true;
    }
  },
  imagePath: {
    type: String,
    default: "https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg"
  },
  mobileno:{
    type:Number,
  },
  token: {
    type:String,
    default:""
  },
  isAdmin: {
    type: Boolean,
    default: false 
  },
  createdAt: {
    type: String,
    default: moment().tz("Asia/Kolkata").format(),
  },
});

adminSchema.methods.sessionUpdator = async function () {
  const currentDate = Date.now();
  console.log(this);
  await this.populate("sessions");
  this.sessions.filter((session) => {
    return session.date >= currentDate;
  });
  return await this.save();
};

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;

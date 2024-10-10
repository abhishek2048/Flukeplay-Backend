const mongoose = require("mongoose");
const SessionModel = require("./SessionModel");
const moment = require("moment-timezone");
const UserSchema = new mongoose.Schema({
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
  mobileno:{
    type:Number,
  },
  email: {
    type: String,
    required: [true, "email is necessary"],
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
  acnt_type : {
    type: String,
  },
  acnt_status: {
    type: String,
    default: "inactive",
  },
  registered_on : {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").format(),
  },
  lastlogin : {
    type: Date,
  },
  imagePath: {
    type: String,
  },
  token: {
    type:String,
    default:""
  },
  isVerified: {
    type: Boolean,
    default: false 
  },
  fromGoogle: {
    type:Boolean,
    default:false
  },
  
  // walletBalance: {
  //   type: Number,
  //   default: 0,
  // },
  // sessions: [{ type: mongoose.Types.ObjectId, ref: SessionModel }],
  
},{timestamps:true});

UserSchema.methods.updator = async function () {
  const currentDate = Date.now();
  console.log(this);
  await this.populate("sessions");
  this.sessions.filter((session) => {
    return session.date >= currentDate;
  });
  return await this.save();
};

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;

const mongoose = require("mongoose");
uri =
  "mongodb+srv://vishnufluke64:6zNadFH2s8j7WK8U@cluster0.cb9hynh.mongodb.net/fulkeDB";


const connectDB = async () => {
  try {
    console.log("Connecting to the Database");
    const obj = await mongoose.connect(uri);
    console.log("connected to mdb");
    return obj;
  } catch (error) {
    console.log(error);
    return error;
  }
};
module.exports = connectDB;

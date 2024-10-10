const connectDB = require("./db/connect");
const User = require("./models/UserModel");

const UserJson = require("./models/UserModel");

const start = async() => {
    try{
        await connectDB();
        await User.deleteMany();
        await User.create(UserJson);
        console.log("success");
    }
    catch(error)
    {
        console.log(error);
    }
};
start();

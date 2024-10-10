const connectDB = require("./db/connect");
const walletTran = require("./models/wallettrans.js");
const walltetJson = require("./wallettrans.json");

const start = async() => {
    try{
        await connectDB();
        //await walletTran.deleteMany();
        await walletTran.create(walltetJson);
        console.log("success");
    }
    catch(error)
    {
        console.log(error);
    }
};

start();

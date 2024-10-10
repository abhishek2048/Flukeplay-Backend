const connectDB = require("./db/connect");
const onlineBooking = require("./models/onlinebooking");
const onlineBookingJson = require("./onlineBooking.json");

const start = async() => {
    try {
        await connectDB();
        await onlineBooking.deleteMany();
        await onlineBooking.create(onlineBookingJson);
        console.log("success")
    } 
    catch (error) 
    {
        console.log(error);
    }
};
start();
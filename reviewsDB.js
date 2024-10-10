const connectDB = require("./db/connect");
const Review = require("./models/ReviewsModel");
const ReviewJson = require("./models/ReviewsModel");

const start = async() => {
    try{
        await connectDB();
        await Review.deleteMany();
        await Review.create(ReviewJson);
        console.log("success");
    }
    catch(error)
    {
        console.log(error);
    }
};

start();
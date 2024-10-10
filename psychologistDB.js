const connectDB = require("./db/connect");
const Psychologist = require("./models/PsychologistModel");

const PsychologistJson = require("./models/PsychologistModel");

const start = async() => {
    try{
        await connectDB();
        await Psychologist.deleteMany();
        await Psychologist.create(PsychologistJson);
        console.log("success");
    }
    catch(error)
    {
        console.log(error);
    }
};
start();

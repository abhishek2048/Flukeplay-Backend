const connectDB = require("./db/connect");
const Register = require("./models/register");

const RegisterJson = require("./regusers.json");

const start = async () => {
  try {
    await connectDB();
    await Register.deleteMany();
    await Register.create(RegisterJson);
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};

start();

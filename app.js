//require("dotenv").config();
const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const connectDB = require("./db/connect");
const body_parser = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 9009;
//const products_routes = require("./routes/products");
const authRouter = require("./routes/authRouter.js");
const userRouter = require("./routes/userRouter.js");
const psychologistRouter = require("./routes/psychologistRouter.js");
const paymentRouter = require("./routes/paymentRouter.js");
const sessionRouter = require("./routes/sessionRouter.js");
const adminRouter = require("./routes/adminRoutes.js");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware.js");
const cookie = require("cookie-parser");
const cors = require("cors");
const { getNotifications } = require("./controllers/psychologistController.js");

app.use(morgan("dev"));

app.get("/test", (req, res) => {
  res.send("Hi I am live ");
});
app.use(cookie());
app.use(body_parser.json());
app.use(cors({
  origin: '*',
  allowedHeaders: "X-Requested-With, Content-Type, auth-token"
}));
app.use("/assets", express.static("assets"));
app.use("/auth/", authRouter);
app.use("/api/user/", userRouter);
app.use("/api/psychologist/", psychologistRouter);
app.use("/api/payment/", paymentRouter);
app.use("/api/session/", sessionRouter);
app.use("/api/v1/admin", adminRouter);
app.get("/getNotification/:userId", getNotifications);
//app.use("/api/v2/admin", adminRouter);
//handle errors
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Conneced to the port : " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

// middleware to handle errors 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
      success: false,
      statusCode,
      message,
  });
});

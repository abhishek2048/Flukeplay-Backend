const StatusCodes = require("http-status-codes");
//middleware to handle error
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(`Error middleware called with error : ${err}`);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "something went wrong";
  res.status(statusCode).json({ msg });
};

module.exports = errorHandlerMiddleware;

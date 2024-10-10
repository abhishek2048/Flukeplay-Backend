const { verifyJWT } = require("../utils/tokenUtils");
const { UnauthenticatedError } = require("../errors/customErrors");

module.exports.authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  //if token is not verified then error is thrown
  if (!token) throw new UnauthenticatedError("Please Login");
  try {
    const { userId, role } = verifyJWT(token);
    req.body.userId = userId;
    req.body.role = role;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Please Login");
  }
};

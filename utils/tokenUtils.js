const jwt = require("jsonwebtoken");
const { errorHandler } = require('../errors/error.js');

module.exports.createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //const token = jwt.sign({data:'olala'}, 'secrethai', {
    expiresIn: "1d",
  });
  return token;
};

module.exports.verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //const decoded = jwt.verify(token, 'secrethai');
  return decoded;
};

module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;     //for accessing the cookie from browser we have to download the cookie-parser package and initialize it in index.js
  console.log('Token:', token); 
  if (!token) {
    return next(errorHandler(401, 'Unauthorized:( You are not logged In!'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err); 
      return next(errorHandler(401, 'Unauthorized:( Some error!'));
    }
    req.user = user;
    next();
  });
};

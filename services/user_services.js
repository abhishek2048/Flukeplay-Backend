const UserModel = require("../models/UserModel");

class user_services {
  static async registeruser(name, email, password) {
    try {
      //console.log(name, email);
      const createuser = new UserModel({ name, email, password });
      return await createuser.save();
    } catch (error) {
      throw error;
    }
  }

  //For token
  //static async generateToken(tokenData, SECERET_KEY, jwt_expires){
    //return jwt.sign(tokenData, SECERET_KEY, {expiresIn:jwt_expires});
}

module.exports = user_services;

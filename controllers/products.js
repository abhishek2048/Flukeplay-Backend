const Product = require("../models/products");
const psychologistModal = require("../models/psychologist");
const userModal = require("../models/UserModel");
const Register = require("../models/UserModel");
const reviewModal = require("../models/reviews");
const walletModal = require("../models/wallettrans");
const user_services = require("../services/user_services");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "WARRIORSWELLNESS";

const getAllProducts = async (req, res) => {
  const myData = await Product.find({});
  res.status(200).json({ myData });
};

const getAllProductsTesting = async (req, res) => {
  res.status(200).json({ msg: "I am getAllProductsTesting" });
};

const getAllRegisteredUsers = async (req, res) => {
  try {
    const myUsers = await Register.find(req.query);
    res.status(200).json({ myUsers });
  } catch (error) {
    throw error;
  }
};

const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name == "") {
      return res.status(400).json({ message: "Please input full name" });
    } else {
      //Existing User Check
      const existingUser = await Register.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "User already Exists" });
      }

      //Hashed Password
      //const hassedPassword = await bcrypt.hash(password,8);
      /*const result = await userModal.create({
            name: name,
            email: email,
            password: hassedPassword
        });*/

      //User Creation

      //const successRes = await user_services.registeruser(name,email,hassedPassword);
      const successRes = await user_services.registeruser(
        name,
        email,
        password
      );

      /*if(successRes){
            res.status(200).json({ 
                    status: 1,
                    message: 'Successfully Inserted'
            });
        } else {
            res.status(200).json({ 
                status: 0,
                message: 'Not Inserted'
        });
        }*/

      //Token Generation
      const token = jwt.sign(
        { email: successRes.email, id: successRes._id },
        SECRET_KEY
      );
      res.status(201).json({ successRes: successRes, token: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong during Sign up" });
    throw error;
  }
};

// SIGN IN MECHANISM
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Register.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    //const matchPassword = await bcrypt.compare(password, existingUser.password);
    const matchPassword = existingUser.password;
    if (password !== existingUser.password) {
      return res.status(400).json({ message: "Invaliid Password" });
    }

    /*if(!matchPassword){
            return res.status(400).json({message: "Invalid Password"});
        }*/

    let tokenData = { id: existingUser._id, email: existingUser.email };

    //To use this also uncomment code in user_services generateToken
    //const token = await user_services.generateToken(tokenData, SECRET_KEY, '1h');
    //res.status(200).json({status:true, token:token});

    token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    res
      .status(201)
      .json({ successRes: existingUser, token: token, status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    throw error;
  }
};

const managePsychologist = async (req, res) => {
  try {
    const myData = await psychologistModal.find({});
    res.status(200).json(myData);
  } catch (error) {
    throw error;
  }
};

const psyprofiledata = async (req, res) => {
  try {
    const psyData = await psychologistModal.find(req.query);
    res.status(200).json(psyData);
  } catch (error) {
    throw error;
  }
};

const userReviewData = async (req, res) => {
  try {
    const reviewData = await reviewModal.find(req.query);
    res.status(200).json(reviewData);
  } catch (error) {
    throw error;
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const walletBalance = await walletModal.find(req.query).sort("-transDate");
    res.status(200).json(walletBalance);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProducts,
  getAllProductsTesting,
  getAllRegisteredUsers,
  registration,
  signin,
  managePsychologist,
  psyprofiledata,
  userReviewData,
  getWalletBalance,
};

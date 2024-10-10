const UserModel = require("../models/UserModel");
//const ReviewsModel = require("../models/ReviewsModel");
const WalletTransactionsModel = require("../models/WalletTransactionsModel");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors/customErrors");
const { errorHandler } = require('../errors/error');
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { createJWT, verifyJWT } = require("../utils/tokenUtils");
const user_services = require("../services/user_services");
const StatusCodes = require("http-status-codes");
const BookingModel = require("../models/BookingModel");
const ReviewModel = require("../models/ReviewsModel");
const psychologistModal = require("../models/PsychologistModel");
const SessionModel = require("../models/SessionModel");
const {sendMailUser, SendMailVerifyEmail, SendOtpDelete} = require("../services/mailingService");
const randomstring = require('randomstring');
const Notification = require("../models/NotificationModal");
const VideoModel = require("../models/VideoModel");
const DeleteModel = require("../models/DeleteRequestModel");
const CategoryModel = require("../models/CategoryModal");
const WhatsappModel = require("../models/Whatsapp");

//const stripe = require("stripe")(process.env.STRIPE_SECRET);
//login user with email only
const login = async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if(user && !user.isVerified){
    return next(errorHandler(403, "Your account is not verified yet! Please verify you email."))
  }
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser)
    return next(new UnauthenticatedError("invalid credentials"));

  const token = createJWT({
    userId: user._id,
    role: "USER",
    imageURL: user.imagePath,
  });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  //res.status(StatusCodes.OK).json({ 
    //user,
    //msg: "user logged in" 
    res.send(user)
    //res.StatusCodes(201)
  //});
  console.log(token);
};

//fetch the list of all users
const getAllUsers = async (req, res) => {
  try {
    const myUsers = await UserModel.find(req.query);
    res.status(200).json({ myUsers });
  } catch (error) {
    throw error;
  }
};

//register user
const register = async (req, res, next) => {

  const {fname, mname, lname, mobileno, password, imagePath, email} = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if(existingUser){
      return  next(errorHandler(400, "User Already exists!"));
    }
    const hashedPassword = await hashPassword(password);
    if (req.query.referralId) {
      const referrer = await UserModel.findById(req.query.referralId);
      if (referrer) {
        req.body.walletBalance = 100;
        referrer.walletBalance += 100;
        await referrer.save();
      } else {
        return next(new BadRequestError("Invalid Referral ID"));
      }
    }
    if(fname === ""||lname===""){
      return res.status(StatusCodes.NotFoundError).json({message: 'Please enter Name'});
    } else if (email === ""){ 
      return res.status(StatusCodes.NotFoundError).json({message: 'Please enter email'})
    } else if (password === ""){
      return res.status(StatusCodes.NotFoundError).json({message: 'Please enter password'})
    }
    const token = Math.floor(100000 + Math.random() * 900000);
    const newUser = new UserModel({
      fname,
      mname,
      lname,
      email,
      password: hashedPassword,
      mobileno,
      token,
    });
    const name = newUser.fname + " " + newUser.lname;
    await newUser.save();
    SendMailVerifyEmail(name, newUser.email, token);
    const {password: pass, ...rest} = newUser._doc;
    res.status(200).json({
      message:"Registration Successfull! An OTP has been sent to your email. Verify by entering the OTP",
      rest
    });
  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
};

//verify user email:
const verifyEmail = async(req, res, next)=>{
  try {
    const {token, email} = req.body;
  const validUser = await UserModel.findOne({token});
  if(!validUser){
    const user = await UserModel.updateOne(
      {email},
      {$set: {token:""}},
      {new:true}
    );
    return next(errorHandler(403, 'Invalid OTP Entered. You have to verify again'));
  }else{
    const user = await UserModel.findByIdAndUpdate(
      {
        _id: validUser._id
      },
      {
        $set: {
          token:"",
          isVerified: true,
        }
      },
      {new:true}
    );
    return res.status(200).json({
      success: true,
      message: "Your Account has been verified Successfully! Please Login",
    });
  }
  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
  
}



//Login user via Google: 

const GoogleLoginUser = async (req, res, next) => {
  try {
    const { email, username, photoUrl} = req.body;
    const requestedUser = await UserModel.findOne({ email });
    //if user already registered
    if (requestedUser) {      
      //for setting up token with cookie
      const user = requestedUser;      
      const obj = {
        userId: user._id,
        role: "USER",
      };
      const {password, ...rest} = user._doc;
      const token = createJWT(obj);
      const oneDay = 1000 * 60 * 60 * 24;
      return res
        .status(StatusCodes.ACCEPTED)
        .cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + oneDay),
          secure: process.env.NODE_ENV === "production",
        })
        .json({ msg: "User Logged In Successfully", token, rest });
    }
    // if user is not registered
    const newUser = new UserModel({
      name: req.body.username, 
      email: req.body.email,
      imagePath: req.body.photoUrl,
      fromGoogle: true,
    });
    await newUser.save();
    const token = createJWT({
      userId: newUser._id,
      role: "USER",
      imageURL: newUser.imagePath,
    });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
    });
    // res.send(newUser)
    const {password, ...rest} = newUser._doc;
    return res
      .status(StatusCodes.ACCEPTED)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
      })
      .json({ msg: "User Logged In Successfully", token, rest });
  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
};

//forget password:
const forgetpassword= async( req, res, next)=>{
  try {
    const {email} = req.body;
    const validUser = await UserModel.findOne({email});
    if(!validUser){
      return next(errorHandler(403, 'You are not registered!!! Please Register.'))
    }else{
      const token = Math.floor(100000 + Math.random() * 900000);
      const tokenUpdation = await UserModel.updateOne(
        {email},
        {$set:{token}},
        {new:true}
      );
      sendMailUser(validUser.name, validUser.email, token);
      res.status(200).json({
        message: "An OTP has been sent to your email. Change your password by entering the OTP",
        t: token
      });
    }
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
}

//reset password: 
const resetpassword = async(req, res, next) => {
  const {token, email} = req.body;
  const validUser = await UserModel.findOne({token});
  if(!validUser){
    const user = await UserModel.updateOne(
      {email},
      {$set: {token:""}},
      {new:true}
    );
    return next(errorHandler(403, 'Invalid OTP Entered. You have to verify again'));
  }else{
    const hashedPassword =await hashPassword(req.body.password);
    const user = await UserModel.findByIdAndUpdate(
      {
        _id: validUser._id
      },
      {
        $set: {
          password: hashedPassword, 
          token:""
        }
      },
      {new:true}
    );
    return res.status(200).json({
      success: true,
      message: "Password has been changed successfully!",
    })
  }
};



//update user profile:
const updateUserProfile = async( req , res, next) => {

  try {
    // console.log("Token: ", req.user);
    // console.log('req.user:', req.body.userId);
    // console.log('req.params.userId:', req.params.userId);

    if(req.body.userId !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to make updation. Please aunthenticate yourself!'))
    }

    const { fname, mname, lname, mobileno, imagePath} = req.body;
    const updateUser = await UserModel.findByIdAndUpdate(req.params.userId, {
      $set: {
        fname,
        mname,
        lname,
        mobileno,
        imagePath,
      }
          // set is going to check wheather the data is being changed otherwise it will simply ignore it
    }, {new: true});
    // console.log(updateUser);

    const {password, ...rest} = updateUser._doc;

    return res
    .status(200)
    .json({ msg: "User Profile Updated Successfully", rest });

  } catch (error) {
    console.log(error);
    return next(errorHandler(403, "SOMETHING WENT WRONG IN UPDATION!!"));
  }

}

//for logging out the user or psychologist
const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

//fetch user profile
const getProfile = async(req, res, next) => {
  try {
    const user = await UserModel.findById(req.query.userId);
    if (!user) return next(new BadRequestError("User does not exist"));

    const returnObj = {
      fname: user.fname,
      mname: user.mname,
      lname: user.lname,
      email: user.email,
      mobileno: user.mobileno,
      registered_on: user.registered_on,
      imagePath: user.imagePath,
      isVerified: user.isVerified,
      lastlogin: user.lastlogin,
    };

    res.status(200).json(returnObj);
  } catch (e) {
    next(new BadRequestError());
  }
};

//get user balance
const getBalance = async (req, res, next) => {
  const user = await UserModel.findById(req.body.userId);
  // console.log(user);
  if (!user) return next(new NotFoundError("User doesn't exists"));

  return res.status(StatusCodes.OK).json({
    walletBalance: user.walletBalance,
  });
};

//recharge wallet
const recharge = async (req, res) => {
  try {
    const id = req.body.userId;
    const user = await UserModel.findById(id);
    user.walletBalance += req.body.amount;
    await user.save();
    res.status(200).json(user.walletBalance);
  } catch (error) {
    throw error;
  }
};

//get all sessions of the user
const getUserSessions = async (req, res, next) => {
  try {
    if(Object.keys(req.query).length === 0){
      const {userId } = await req.body;
      const user = await UserModel.findById(userId);
      //user.sessionUpdator();
      await user.populate("sessions");
      return res.status(StatusCodes.OK).json(user.sessions);
    }else{
      if(req.query.psychologistId){
        const userSessions = await SessionModel.find({
          psychologistId: req.query.psychologistId,
          userId: req.body.userId,
        });
        return res.status(StatusCodes.OK).json(userSessions);
      }
      else if(req.query.sessionId){
        const userSessions = await SessionModel.find({
          _id:req.query.sessionId,
          userId: req.body.userId,
        });
        return res.status(StatusCodes.OK).json(userSessions);
      }
      else{
        return next(errorHandler(400, 'Something went WRONG!'))
      }
    }
  } catch (e) {
    return next(new BadRequestError(e.message));
  }
};

//forget password:
const updatepassword= async( req, res, next)=>{
  try {
    // console.log("Token: ", req.user);
    // console.log('req.user:', req.body.userId);
    // console.log('req.params.userId:', req.params.userId);

    if(req.body.userId !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to make password change. Please aunthenticate yourself!'))
    }
    
    if(req.body.password){
        req.body.password =await hashPassword(req.body.password);
    }
    const user = await UserModel.findByIdAndUpdate(req.params.userId, {
      $set: {
        password: req.body.password,
      }
    }, {new: true});
    // console.log(updateUser);
    

    const {password, ...rest} = user._doc;

    return res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: "User Password Updated Successfully", rest });

  } catch (error) {
    console.log(error);
    return next(errorHandler(403, "SOMETHING WENT WRONG IN UPDATION!!"));
  }

}

//get the transaction history of the user
const getUserTransactions = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const transactionHistory = await WalletTransactionsModel.find({
      userId,
    }).sort("-date");
    res.status(200).json(transactionHistory);
  } catch (e) {
    return next(new BadRequestError(e.message));
  }
};

//get the booking history of the user
const getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find({ userId: req.body.userId });
    return res.status(StatusCodes.OK).json(bookings);
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};

//post review for a psychologist
const postreview = async (req, res, next) => {

  try {
     /* 
    const previousReview = await ReviewModel.findOne({
      userId: req.body.userId,
      psychologistId: req.body.psychologistId,
    });
    if (previousReview) {
      return next(new BadRequestError("Review already exists"));
    }
    */
    const review = await ReviewModel.create(
      {
        userId: req.body.userId,
        videoId: req.body.videoId,
        stars: req.body.stars,
        review: req.body.comment,
      }
    );

    await review.populate('userId');
    await review.populate('videoId')
    await review.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Comment is created successfully", review });
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};


//delete a review
const deletereview = async (req, res, next) => {
  try {
    const reviewId = req.query.reviewId;
    const review = await ReviewModel.findById(reviewId);
    if (!review) return next(new BadRequestError("Review Doesn't exists"));
    if (review.userId.toString() !== req.params.userId) {
      return next(new UnauthorizedError("You are not allowed to delete this review!!"));
    }
    const psychologist = await psychologistModal.findById(
      review.psychologistId
    );
    psychologist.totalReviews--;
    psychologist.totalStars -= review.stars;
    await psychologist.save();
    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);
    return res
      .status(StatusCodes.OK)
      .json({ message: "The review was deleted successfully", deletedReview });
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};


//edit review of a user
const editreview = async (req, res, next) => {
  try {
    const reviewId = req.query.reviewId;

    const revieww = await ReviewModel.findById(reviewId);

    if (revieww.userId.toString() !== req.params.userId) {
      return next(new UnauthorizedError("You are not allowed to delete this review!!"));
    }

    const { stars, review } = req.body;
    const psychologist = await psychologistModal.findById(
      revieww.psychologistId
    );

    psychologist.totalStars -= revieww.stars;
    psychologist.totalStars += stars;

    revieww.stars = stars;
    revieww.review = review;
    await revieww.save();

    await psychologist.save();
    
    return res
      .status(StatusCodes.OK)
      .json({ message: "Review was updated successfully", revieww });
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};

//fetch the all comments of a video
const getVideoComments = async (req, res, next) => {
  
  try {
    const reviews = await ReviewModel.find({ videoId: req.params.videoId })
    .populate("userId")
    if(!reviews){
      next(errorHandler(404, "No comments for this video!"));
    }
    return res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};

// to save notification 
const saveNotification = async(req, res, next) => {
  const { userId, videoId, message, title } = req.body;
  try {
    const notification = new Notification({
      userId,
      videoId, 
      message,
      title,
    });
    await notification.save();
    res.status(200).json({
      message: "Notification saved successfully!",
      notification,
    });
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
}

//getnotification: 
const getNotification = async (req, res) => {
  const { userId, videoId} = req.query
  try {
    const userAllNotifications = await Notification.find({ 
      userId, 
    })
    .populate("videoId");
    const userNotificationForVideo = await Notification.find({ 
      userId,
      videoId, 
    })
    .populate("videoId");

    res.status(200).json({userAllNotifications, userNotificationForVideo});
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//for saving video in database:
const saveVideo = async (req, res, next) => {
  const {userId, videoTitle, videoURL, thumbnail, description, category, paid} = req.body;
  try {
    const video = new VideoModel({
      userId,
      videoURL,
      videoTitle,
      thumbnail,
      description,
      category,
      paid,
    });
    await VideoModel.populate(video, { path: "userId" });
    await video.save();
    return res.status(200).json({
      success: true,
      message: "Video saved Successfully",
      video
    })
  } catch (error) {
    next(error);
  }
}

//for fetching all videos: 
const fetchAllVideo = async (req, res, next) => {
  try {
    const videos = await VideoModel.find()
    .populate("userId");
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    next(error);
  }
}

//for fetching video all videos:
const fetchVideo = async (req, res, next) => {
  const category = req.params.category;
  try {
    const videos = await VideoModel.find({category}).populate("userId");
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    next(error);
  }
}

const createCategory = async(req, res, next)=>{
  try {
    const { cat } = req.body;
    const category = new CategoryModel({
      categoryName: cat,
    })
    await category.save();
    return res.status(200).json({category});
  } catch (error) {
    console.log(error);
    return res.status(501).json({error});
  }
}
const getAllCategories = async(req, res, next)=>{
  try {
    const category = await CategoryModel.find();
    return res.status(200).json({
      success:true,
      category
    })
  } catch (error) {
    res(500).json("Error: ", error.message);
  }
}


const sendOtp = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User does not exists"
      });
    }
    const token = Math.floor(100000 + Math.random() * 900000);
    user.token  = token;
    await (user && user.save());
    SendOtpDelete(user.email, user.token);
    const { password: pass, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      message: "An OTP has been sent to your email. Verify by entering the OTP",
      rest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

//for otp verification pf email id for delete request:
const verifyEmailForDelete = async(req, res, next)=>{
  try {
    const {email} = req.body;
    const user = await UserModel.findOne({ email: email });
    const existingreq = await DeleteModel.findOne({email});
    if(existingreq){
      return res.status(406).json({
        success: false,
        message: "Delete request already exists. Please wait. Your data will be deleted soon."
      })
    }
    const newrequest = new DeleteModel({
      userId: user._id,
      fname: user.fname ,
      mname: user.mname ,
      lname: user.lname ,
      email: email
    })
  await newrequest.save();
    return res.status(200).json({
      success: true,
      message: "Your Request has been verified Successfully!Your data will be deleted soon.",
      newrequest
    });

  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
  
}

const createWhats = async(req, res, next)=>{
  const wh = new WhatsappModel({
    link: "whatsapp2.com",
  });
  await wh.save();
  return res.status(200).json(wh);
}

const getWhatsapp = async(req, res, next)=>{
  try {
    let wh = await WhatsappModel.find();
    return res.status(200).json(wh);
  } catch (error) {
    console.log(error);
    res.status(501).json(error.message);
  }
}



module.exports = {
  getAllUsers,
  register,
  verifyEmail,
  logout,
  login,
  updateUserProfile,
  recharge,
  getProfile,
  getBalance,
  getUserSessions,
  getUserTransactions,
  getBookingHistory,
  getVideoComments,
  postreview,
  editreview,
  deletereview,
  GoogleLoginUser,
  updatepassword,
  forgetpassword,
  resetpassword,
  saveNotification,
  getNotification,
  saveVideo,
  fetchAllVideo,
  fetchVideo,
  getAllCategories,
  sendOtp,
  verifyEmailForDelete,
  createCategory,
  createWhats,
  getWhatsapp,
};

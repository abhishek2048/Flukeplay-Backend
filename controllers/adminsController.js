const adminModel = require("../models/AdminModal");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { createJWT } = require("../utils/tokenUtils");
const StatusCodes = require("http-status-codes");
const {SendAdminVerifyEmail} = require("../services/mailingService");
const { errorHandler } = require("../errors/error");
const UserModel = require("../models/UserModel");
const SessionModel = require("../models/SessionModel");
const walletModal = require("../models/WalletTransactionsModel");
const ReviewModel = require("../models/ReviewsModel");
const psychologistModal = require("../models/PsychologistModel");
const BookingModel = require("../models/BookingModel");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors/customErrors");
const VideoModel = require("../models/VideoModel");
const DeleteModel = require("../models/DeleteRequestModel");

//register admin:
const register = async (req, res, next) => {

    const {username, email, password, mobileno, imagePath } = req.body;
    try {
      const existingUser = await adminModel.findOne({ email });
      if(existingUser){
        return  next(errorHandler(400, "User Already exists!"));
      }
      const hashedPassword = await hashPassword(password);
      if (req.query.referralId) {
        const referrer = await adminModel.findById(req.query.referralId);
        if (referrer) {
          req.body.walletBalance = 100;
          referrer.walletBalance += 100;
          await referrer.save();
        } else {
          return next(new BadRequestError("Invalid Referral ID"));
        }
      }
      if(username === ""){
        return res.status(StatusCodes.NotFoundError).json({message: 'Please enter Name'});
      } else if (email === ""){ 
        return res.status(StatusCodes.NotFoundError).json({message: 'Please enter email'})
      } else if (password === ""){
        return res.status(StatusCodes.NotFoundError).json({message: 'Please enter password'})
      }
      const token = Math.floor(100000 + Math.random() * 900000);
      const newAdmin= new adminModel({
        name:username,
        email,
        password: hashedPassword,
        mobileno,
        token,
        imagePath,
      });
      await newAdmin.save();
      SendAdminVerifyEmail(newAdmin.name, newAdmin.email, token);
      const {password: pass, ...rest} = newAdmin._doc;
      res.status(200).json({
        message:"Registration Successfull! An link has been sent to your email. Verify by clicking on the link",
        rest
      });
    } catch (error) {
      return res.status(505).json({
        success: false,
        message: error.message
      })
    }
  };

//verify admin email:
const verifyEmail = async(req, res, next)=>{
    try {
        const {token, email} = req.query;
        const validAdmin = await adminModel.findOne({token});
        if(!validAdmin){
            const admin = await adminModel.updateOne(
                {email},
                {$set: {token:""}},
                {new:true}
            );
            return next(errorHandler(403, 'Invalid token Entered. You have to verify again'));
        }else{
            const user = await adminModel.findByIdAndUpdate(
                {
                _id: validAdmin._id
                },
                {
                    $set: {
                        token:"",
                        isAdmin: true,
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
      return res.status(200).json({
        success: false,
        message: "Your Account hasn't been verified ! Please verify again",
    });
    } 
}

//login Admin: 
const login = async (req, res, next) => {
    const admin = await adminModel.findOne({ email: req.body.email });
    if(!admin){
        return res.status(403).json({
          success: false,
          message: "You are not registered! Please register yourself."
        })
    }
    if(!admin.isAdmin){
      return res.status(403).json({
        success: false,
        message: "Your account is not verified yet! Please verify you email."
      });
    }
    const isValidAdmin =
      admin && (await comparePassword(req.body.password, admin.password));
    if (!isValidAdmin){
      return res.status(403).json({
        success: false,
        message: "Invalid Credentials"
      });
    }
    const token = createJWT({
      userId: admin._id,
      role: "ADMIN",
      imageURL: admin.imagePath,
    });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(StatusCodes.OK).json({ 
        msg: "Admin logged in",
        admin,
    });
    console.log(token);
};

//get user profile
const getUserProfile = async(req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) return next(new BadRequestError("User does not exist"));

    const returnObj = {
      name: user.name,
      email: user.email,
      walletBalance: user.walletBalance,
      imagePath: user.imagePath,
    };

    res.status(StatusCodes.OK).json(returnObj);
  } catch (e) {
    next(new BadRequestError());
  }
};

//get all users:
const getAllUsers = async(req, res, next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortDirection = req.query.sort || 'desc'? -1 : 1;

    const users = await UserModel.find()
    .sort({createdAt: sortDirection})
    .skip(startIndex)
    .limit(limit);
    const usersWithoutPassword = users.map((user) => {
      const { password , ...rest} = user._doc;
      return rest;
    });

    const totalUsers = await UserModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() -1,
      now.getDate()
    );
    const lastMonthUsers = await UserModel.countDocuments({
      createdAt: { $gte: oneMonthAgo}
    });
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    })
  } catch (error) {
    next(error);
  }
};

//get all psycs:
const getAllPsycs = async(req, res, next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortDirection = req.query.sort || 'desc'? -1 : 1;

    const psycs = await VideoModel.find()
    .sort({createdAt: sortDirection})
    .skip(startIndex)
    .limit(limit);
  

    const totalVideo = await VideoModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() -1,
      now.getDate()
    );
    const lastMonthVideo = await VideoModel.countDocuments({
      createdAt: { $gte: oneMonthAgo}
    });
    res.status(200).json({
      psycs,
      totalVideo,
      lastMonthVideo,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error,
    })
  }
};

// get all bookings 
const getAllBookings = async(req, res, next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortDirection = req.query.sort || 'desc'? -1 : 1;

    const bookings = await BookingModel.find()
    .sort({createdAt: sortDirection})
    .skip(startIndex)
    .limit(limit);

    const totalBookings = await BookingModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() -1,
      now.getDate()
    );
    const lastMonthBooking = await BookingModel.countDocuments({
      createdAt: { $gte: oneMonthAgo}
    });
    res.status(200).json({
      bookings,
      totalBookings,
      lastMonthBooking,
    })
  } catch (error) {
    next(error);
  }
};

//get all sessions of the user
const getUserSessions = async (req, res, next) => {
  try {
    if(Object.keys(req.query).length === 0){
      const {userId, name} = await req.body;
      const userSessions = await SessionModel.find({userId})
      .populate('psychologistId')
      .populate('userId');

      const result = userSessions.map((ses) => {
        const { password , ...rest} = userSessions;
        return rest;
      });

      return res.status(200).json({userSessions, name});
    }else{
      if(req.query.psychologistId){
        const userSessions = await SessionModel.find({
          psychologistId: req.query.psychologistId,
          userId: req.body.userId,
        });
        return res.status(200).json(userSessions);
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
    return next(new BadRequestError(e));
  }
};

//get the transaction history of the user
const getUserTransactions = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const transactionHistory = await walletModal.find({
      userId,
    }).sort("-date");
    res.status(200).json(transactionHistory);
  } catch (e) {
    return next(new BadRequestError(e.message));
  }
};

//fetch all the reviews of a user:
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({ userId: req.body.userId });
    return res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};

//post review for a psychologist
const postreview = async (req, res, next) => {
 
  try {
    const review = await ReviewModel.create(
      {
        userId: req.body.adminId,
        psychologistId: req.body.psychologistId,
        stars: req.body.stars,
        review: req.body.review,
      }
    );
    await review.save();

    const psychologist = await psychologistModal.findById(
      req.body.psychologistId
    );
    psychologist.totalStars += req.body.stars;

    psychologist.totalReviews++;

    await psychologist.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Review is created successfully", review });
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
    const admin = await adminModel.findById(req.params.adminId);
    if(!admin){
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

    if (revieww.userId.toString() !== req.params.adminId) {
      return next(new UnauthorizedError("You are not allowed to delete this review!!"));
    }
    const { stars, review } = req.body;
    revieww.stars = stars;
    revieww.review = review;
    await revieww.save();
    
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

//get the booking history of the user
const getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find({ userId: req.query.userId });
    return res.status(StatusCodes.OK).json(bookings);
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};

//signout
const signout = async (req, res, next)=>{
  try {
    res.clearCookie('token').status(200).json("User has been signed out")
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
}
//for delete content
const getDelete = async(req, res, next)=>{
  try {
   const del = await DeleteModel.find();
   return res.status(200).json({del}); 
  } catch (error) {
    console.log(error);
    res.status(501).json(error.message);
  }
}
  
module.exports = {
    register,
    verifyEmail,
    login,
    getUserProfile,
    getAllUsers,
    getAllPsycs,
    getAllBookings,
    getUserSessions,
    getUserTransactions,
    getUserReviews,
    postreview,
    deletereview,
    editreview,
    getBookingHistory,
    signout,
    getDelete
}



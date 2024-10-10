const Router = require("express");
const router = Router();
require("../passport");
const passport = require("passport");
const session = require('express-session');
router.use(session({
  secret: 'Secret_key',
  resave: false,
  saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());
const {
  bookPsychologist,
  register,
  verifyEmail,
  login,
  logout,
  GoogleLoginPsyc,
  getPsychologistList,
  getProfile,
  getSchedule,
  updateSlot,
  updateProfile,
  fetchSessionsPsyc,
  getReviews,
  getRating,
  updatePsycProfile,
  updatepassword,
  forgetpassword,
  resetpassword,
  sessionupdate,
} = require("../controllers/psychologistController");
// const { verifyToken } = require("../utils/tokenUtils");
const { authenticateUser } = require("../middleware/authMiddleware");

router.route("/register").post(register);
router.route("/verify").post(verifyEmail);
router.route("/").get(getPsychologistList);
router.route("/profile").get(getProfile).patch(updateProfile);
router.post("/login", login);
router.route("/schedule").get(getSchedule).post(updateSlot);
//fetch Session for a psycologist:
router.route("/sessions").get(fetchSessionsPsyc);
router.get("/reviews", getReviews);
router.get("/rating", getRating);
//Login via Google
router.route("/google").post(GoogleLoginPsyc);
// This is for psyc profile update:
router.route("/update/:psycId").post(authenticateUser, updatePsycProfile);
// This is for psyc Logout:
router.route("/logout").get(logout);
// This is for psyc updatepassword:
router.route("/updatepassword/:psycId").post(authenticateUser, updatepassword );
// This is for psyc forgetpassword:
router.route("/forgetpassword").post(forgetpassword);
router.route("/resetpassword").post(resetpassword);
// This is for psyc session update:
router.route("/sessionupdate/:psycId/:sessionId").post(authenticateUser, sessionupdate);



module.exports = router;

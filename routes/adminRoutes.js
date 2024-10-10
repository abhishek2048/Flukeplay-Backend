const Router = require("express");
const { 
    register,
    verifyEmail,
    login,
    getUserProfile,
    getAllUsers,
    getUserSessions,
    getUserTransactions,
    getUserReviews,
    postreview,
    deletereview,
    editreview,
    getBookingHistory,
    signout,
    getAllPsycs,
    getAllBookings,
    getDelete,
 } = require("../controllers/adminsController");
const router = Router();

router.route("/register").post(register);
router.route("/verify").get(verifyEmail);
router.route("/login").post(login);
router.route("/getuser/:userId").get(getUserProfile);
router.route("/getallusers").get(getAllUsers);
router.route("/getallpsycs").get(getAllPsycs);
router.route("/getallbookings").get(getAllBookings);
router.route("/sessions").post(getUserSessions);
router.route("/transactions").get(getUserTransactions);
router.route("/review").get(getUserReviews);
router.route("/review").post(postreview);
router.route("/review/:adminId").delete(deletereview);
router.route("/review/:adminId").put(editreview);
router.route("/bookinghistory").get(getBookingHistory)
router.route("/signout").post(signout);
router.route("/getdelete").get(getDelete);
module.exports = router;